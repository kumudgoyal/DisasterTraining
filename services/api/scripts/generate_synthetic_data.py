import csv
import os
import random
import uuid
from datetime import datetime, timedelta
from faker import Faker

fake = Faker('en_IN')

# Setup paths
OUTPUT_DIR = "disaster-training-dataset"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# 1. States & Districts Data (Static mapping)
INDIAN_STATES = {
    "Punjab": [("Ludhiana", 30.9010, 75.8573), ("Patiala", 30.3398, 76.3869), ("Amritsar", 31.6340, 74.8723), ("Mohali", 30.7046, 76.7179), ("Jalandhar", 31.3260, 75.5762)],
    "Assam": [("Guwahati", 26.1445, 91.7362), ("Silchar", 24.8333, 92.7789), ("Dibrugarh", 27.4728, 94.9120), ("Jorhat", 26.7509, 94.2037)],
    "Odisha": [("Bhubaneswar", 20.2961, 85.8245), ("Cuttack", 20.4625, 85.8828), ("Puri", 19.8135, 85.8312), ("Balasore", 21.4934, 86.9337)],
    "Kerala": [("Thiruvananthapuram", 8.5241, 76.9366), ("Kochi", 9.9312, 76.2673), ("Kozhikode", 11.2588, 75.7804), ("Wayanad", 11.6854, 76.1320)],
    "Maharashtra": [("Mumbai", 19.0760, 72.8777), ("Pune", 18.5204, 73.8567), ("Nagpur", 21.1458, 79.0882), ("Nashik", 19.9975, 73.7898)],
    "Himachal Pradesh": [("Shimla", 31.1048, 77.1734), ("Manali", 32.2396, 77.1887), ("Dharamshala", 32.2190, 76.3234), ("Mandi", 31.5892, 76.9328)]
}

# Training Themes
THEMES = ["Flood Preparedness", "Fire Safety", "Earthquake Response", "Cyclone Evacuation", "Landslide Rescue", "Medical First Aid", "Community Response", "Search & Rescue"]

# Organizations
ORGS = [
    {"name": "National Disaster Response Force (NDRF)", "type": "GOVERNMENT"},
    {"name": "State Disaster Response Force (SDRF)", "type": "GOVERNMENT"},
    {"name": "Indian Red Cross Society", "type": "NGO"},
    {"name": "Fire & Rescue Services", "type": "GOVERNMENT"},
    {"name": "Armed Forces Medical Services", "type": "GOVERNMENT"},
    {"name": "Aapda Mitra", "type": "OTHER"},
    {"name": "Save The Children India", "type": "NGO"}
]

# Write CSV Helper
def write_csv(filename, fieldnames, data):
    path = os.path.join(OUTPUT_DIR, filename)
    with open(path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(data)
    print(f"Generated {filename} ({len(data)} rows)")

def generate_data():
    print("Generating Synthetic Disaster Training Dataset...")
    
    # Generate States and Districts
    states_data = []
    districts_data = []
    state_id_map = {}
    district_list = []
    
    s_idx = 1
    d_idx = 1
    for state, districts in INDIAN_STATES.items():
        states_data.append({"state_id": s_idx, "name": state, "code": state[:2].upper()})
        state_id_map[state] = s_idx
        for dist, lat, lon in districts:
            district_obj = {"district_id": d_idx, "name": dist, "state_id": s_idx, "lat": lat, "lon": lon}
            districts_data.append(district_obj)
            district_list.append(district_obj)
            d_idx += 1
        s_idx += 1
        
    write_csv("states.csv", ["state_id", "name", "code"], states_data)
    write_csv("districts.csv", ["district_id", "name", "state_id", "lat", "lon"], districts_data)
    
    # Generate Organizations
    orgs_data = []
    for org in ORGS:
        orgs_data.append({
            "org_id": str(uuid.uuid4()),
            "name": org["name"],
            "type": org["type"],
            "state": "National" if org["type"] in ["GOVERNMENT", "MILITARY"] else random.choice(list(INDIAN_STATES.keys()))
        })
    write_csv("organizations.csv", ["org_id", "name", "type", "state"], orgs_data)
    
    # Generate Trainings (200 records)
    trainings_data = []
    start_date_base = datetime(2024, 1, 1)
    
    for i in range(200):
        t_id = str(uuid.uuid4())
        theme = random.choice(THEMES)
        org = random.choice(orgs_data)
        dist = random.choice(district_list)
        
        start_date = start_date_base + timedelta(days=random.randint(0, 360))
        end_date = start_date + timedelta(days=random.randint(1, 5))
        
        # Add slight jitter to coordinates so they aren't perfectly on the city centroid
        lat = dist["lat"] + random.uniform(-0.05, 0.05)
        lon = dist["lon"] + random.uniform(-0.05, 0.05)
        
        capacity = random.randint(20, 150)
        
        trainings_data.append({
            "training_id": t_id,
            "title": f"{dist['name']} {theme} Workshop",
            "theme": theme,
            "org_id": org["org_id"],
            "state_id": dist["state_id"],
            "district_id": dist["district_id"],
            "start_date": start_date.strftime("%Y-%m-%d"),
            "end_date": end_date.strftime("%Y-%m-%d"),
            "lat": round(lat, 6),
            "lon": round(lon, 6),
            "capacity": capacity,
            "status": "COMPLETED" if start_date < datetime.now() else "SCHEDULED"
        })
        
    write_csv("trainings.csv", ["training_id", "title", "theme", "org_id", "state_id", "district_id", "start_date", "end_date", "lat", "lon", "capacity", "status"], trainings_data)

    # Generate Participants & Attendance
    participants_data = []
    attendance_data = []
    assessments_data = []
    impact_data = []
    
    for training in trainings_data:
        if training["status"] != "COMPLETED": continue
        
        num_participants = int(training["capacity"] * random.uniform(0.7, 1.0))
        
        pre_scores = []
        post_scores = []
        
        for _ in range(num_participants):
            p_id = str(uuid.uuid4())
            p_name = fake.name()
            p_gender = random.choice(["MALE", "FEMALE"])
            
            participants_data.append({
                "participant_id": p_id,
                "name": p_name,
                "gender": p_gender,
                "designation": random.choice(["First Responder", "Volunteer", "Officer", "Doctor", "Fireman"]),
                "district_id": training["district_id"]
            })
            
            attendance_data.append({
                "attendance_id": str(uuid.uuid4()),
                "training_id": training["training_id"],
                "participant_id": p_id,
                "status": "PRESENT"
            })
            
            # Assessments
            pre_k = random.uniform(40, 70)
            pre_p = random.uniform(40, 70)
            pre_c = random.uniform(40, 70)
            
            post_k = min(100, pre_k + random.uniform(10, 30))
            post_p = min(100, pre_p + random.uniform(10, 35))
            post_c = min(100, pre_c + random.uniform(15, 40))
            
            pre_scores.append(pre_k)
            post_scores.append(post_k)
            
            assessments_data.append({
                "assessment_id": str(uuid.uuid4()),
                "training_id": training["training_id"],
                "participant_id": p_id,
                "pre_knowledge": round(pre_k, 2),
                "post_knowledge": round(post_k, 2),
                "pre_preparedness": round(pre_p, 2),
                "post_preparedness": round(post_p, 2),
                "pre_confidence": round(pre_c, 2),
                "post_confidence": round(post_c, 2)
            })
            
        # Impact Assessment per training
        if len(pre_scores) > 0:
            avg_pre = sum(pre_scores) / len(pre_scores)
            avg_post = sum(post_scores) / len(post_scores)
            improvement = avg_post - avg_pre
            
            impact_data.append({
                "impact_id": str(uuid.uuid4()),
                "training_id": training["training_id"],
                "avg_improvement": round(improvement, 2),
                "participants_assessed": num_participants
            })
            
    write_csv("participants.csv", ["participant_id", "name", "gender", "designation", "district_id"], participants_data)
    write_csv("attendance.csv", ["attendance_id", "training_id", "participant_id", "status"], attendance_data)
    write_csv("assessments.csv", ["assessment_id", "training_id", "participant_id", "pre_knowledge", "post_knowledge", "pre_preparedness", "post_preparedness", "pre_confidence", "post_confidence"], assessments_data)
    write_csv("impact_assessments.csv", ["impact_id", "training_id", "avg_improvement", "participants_assessed"], impact_data)

    print("Synthetic dataset generation complete!")

if __name__ == "__main__":
    generate_data()
