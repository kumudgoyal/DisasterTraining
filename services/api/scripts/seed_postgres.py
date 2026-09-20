import csv
import psycopg2
import uuid
import os

DATABASE_URL = "postgresql://postgres:password@localhost:5432/disaster_training_db"
CSV_DIR = "disaster-training-dataset"

def load_data():
    conn = psycopg2.connect(DATABASE_URL)
    conn.autocommit = False
    cur = conn.cursor()

    try:
        print("Truncating existing tables...")
        # TRUNCATE tables safely
        tables = [
            "impact_assessments", "post_assessments", "pre_assessments",
            "attendance", "training_participants", "participants", "trainings",
            "organizations", "users", "districts", "states", "training_themes", "training_types"
        ]
        cur.execute(f"TRUNCATE TABLE {', '.join(tables)} CASCADE;")

        print("Loading States...")
        with open(os.path.join(CSV_DIR, "states.csv"), 'r') as f:
            reader = csv.DictReader(f)
            for row in reader:
                cur.execute(
                    "INSERT INTO states (id, name, code) VALUES (%s, %s, %s)",
                    (row["state_id"], row["name"], row["code"])
                )

        print("Loading Districts...")
        with open(os.path.join(CSV_DIR, "districts.csv"), 'r') as f:
            reader = csv.DictReader(f)
            for row in reader:
                cur.execute(
                    "INSERT INTO districts (id, name, state_id, centroid) VALUES (%s, %s, %s, ST_SetSRID(ST_MakePoint(%s, %s), 4326))",
                    (row["district_id"], row["name"], row["state_id"], row["lon"], row["lat"])
                )

        print("Loading Organizations...")
        with open(os.path.join(CSV_DIR, "organizations.csv"), 'r') as f:
            reader = csv.DictReader(f)
            for row in reader:
                cur.execute(
                    "INSERT INTO organizations (id, name, type, state) VALUES (%s, %s, %s, %s)",
                    (row["org_id"], row["name"], row["type"], row["state"])
                )

        print("Creating default User, TrainingType, and TrainingThemes...")
        user_id = str(uuid.uuid4())
        cur.execute(
            "INSERT INTO users (id, name, email, password_hash, role, is_active, created_at, updated_at) VALUES (%s, 'Admin', 'admin@example.com', 'hash', 'SUPER_ADMIN', true, NOW(), NOW())",
            (user_id,)
        )
        
        cur.execute("INSERT INTO training_types (id, name, is_active) VALUES (1, 'Workshop', true)")
        
        theme_map = {}
        theme_idx = 1
        
        with open(os.path.join(CSV_DIR, "trainings.csv"), 'r') as f:
            reader = csv.DictReader(f)
            trainings = list(reader)
            
        for row in trainings:
            if row["theme"] not in theme_map:
                theme_map[row["theme"]] = theme_idx
                cur.execute("INSERT INTO training_themes (id, name, is_active) VALUES (%s, %s, true)", (theme_idx, row["theme"]))
                theme_idx += 1

        print("Loading Trainings...")
        for row in trainings:
            cur.execute(
                """INSERT INTO trainings 
                (id, title, type_id, theme_id, org_id, created_by, start_date, end_date, state_id, district_id, capacity, status, location, created_at, updated_at) 
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, ST_SetSRID(ST_MakePoint(%s, %s), 4326), NOW(), NOW())""",
                (row["training_id"], row["title"], 1, theme_map[row["theme"]], row["org_id"], user_id, row["start_date"], row["end_date"], row["state_id"], row["district_id"], row["capacity"], row["status"], row["lon"], row["lat"])
            )

        print("Loading Participants...")
        with open(os.path.join(CSV_DIR, "participants.csv"), 'r') as f:
            reader = csv.DictReader(f)
            for row in reader:
                cur.execute(
                    "INSERT INTO participants (id, name, gender, designation, district_id, created_at) VALUES (%s, %s, %s, %s, %s, NOW())",
                    (row["participant_id"], row["name"], row["gender"], row["designation"], row["district_id"])
                )

        print("Loading Attendance...")
        with open(os.path.join(CSV_DIR, "attendance.csv"), 'r') as f:
            reader = csv.DictReader(f)
            tp_set = set()
            for row in reader:
                tp_key = (row["training_id"], row["participant_id"])
                if tp_key not in tp_set:
                    cur.execute(
                        "INSERT INTO training_participants (id, training_id, participant_id, enrolled_at) VALUES (%s, %s, %s, NOW())",
                        (str(uuid.uuid4()), row["training_id"], row["participant_id"])
                    )
                    tp_set.add(tp_key)
                    
                cur.execute(
                    "INSERT INTO attendance (id, training_id, participant_id, attendance_date, status, marked_by, marked_at) VALUES (%s, %s, %s, NOW(), %s, %s, NOW())",
                    (row["attendance_id"], row["training_id"], row["participant_id"], row["status"], user_id)
                )

        print("Loading Assessments...")
        with open(os.path.join(CSV_DIR, "assessments.csv"), 'r') as f:
            reader = csv.DictReader(f)
            for row in reader:
                overall_pre = (float(row["pre_knowledge"]) + float(row["pre_preparedness"]) + float(row["pre_confidence"])) / 3
                cur.execute(
                    """INSERT INTO pre_assessments 
                    (id, training_id, participant_id, knowledge_score, preparedness_score, confidence_score, overall_score, assessed_at) 
                    VALUES (%s, %s, %s, %s, %s, %s, %s, NOW())""",
                    (str(uuid.uuid4()), row["training_id"], row["participant_id"], row["pre_knowledge"], row["pre_preparedness"], row["pre_confidence"], overall_pre)
                )
                
                overall_post = (float(row["post_knowledge"]) + float(row["post_preparedness"]) + float(row["post_confidence"])) / 3
                cur.execute(
                    """INSERT INTO post_assessments 
                    (id, training_id, participant_id, knowledge_score, preparedness_score, confidence_score, overall_score, assessed_at) 
                    VALUES (%s, %s, %s, %s, %s, %s, %s, NOW())""",
                    (row["assessment_id"], row["training_id"], row["participant_id"], row["post_knowledge"], row["post_preparedness"], row["post_confidence"], overall_post)
                )

        print("Loading Impact Assessments...")
        with open(os.path.join(CSV_DIR, "impact_assessments.csv"), 'r') as f:
            reader = csv.DictReader(f)
            for row in reader:
                cur.execute(
                    """INSERT INTO impact_assessments 
                    (id, training_id, avg_knowledge_improvement, avg_preparedness_improvement, avg_confidence_improvement, avg_overall_improvement, impact_score, participants_assessed, calculated_at) 
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, NOW())""",
                    (row["impact_id"], row["training_id"], row["avg_improvement"], row["avg_improvement"], row["avg_improvement"], row["avg_improvement"], row["avg_improvement"], row["participants_assessed"])
                )

        conn.commit()
        print("Successfully loaded all synthetic data into PostgreSQL!")

    except Exception as e:
        conn.rollback()
        print(f"Error loading data: {e}")
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    load_data()
