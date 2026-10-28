/**
 * Database Migration: Initial Schema
 * Creates all tables for the Disaster Management Platform
 */
exports.up = function(knex) {
  return knex.schema
    // Roles
    .createTable('roles', t => {
      t.increments('id').primary();
      t.string('name').unique().notNullable();
      t.text('permissions'); // JSON
      t.timestamp('created_at').defaultTo(knex.fn.now());
    })
    // Organizations
    .createTable('organizations', t => {
      t.increments('id').primary();
      t.string('name').notNullable();
      t.string('type').notNullable(); // government/ngo/military/medical/fire/police/volunteer/relief/other
      t.string('contact_email');
      t.string('contact_phone');
      t.text('address');
      t.string('operating_region');
      t.text('specializations');
      t.string('website');
      t.boolean('is_active').defaultTo(true);
      t.timestamp('created_at').defaultTo(knex.fn.now());
    })
    // Users
    .createTable('users', t => {
      t.increments('id').primary();
      t.string('email').unique().notNullable();
      t.string('password_hash').notNullable();
      t.string('full_name').notNullable();
      t.string('phone');
      t.integer('role_id').unsigned().references('id').inTable('roles');
      t.integer('organization_id').unsigned().references('id').inTable('organizations');
      t.string('district');
      t.string('state');
      t.boolean('is_active').defaultTo(true);
      t.timestamp('last_login');
      t.timestamp('created_at').defaultTo(knex.fn.now());
    })
    // Disaster Types
    .createTable('disaster_types', t => {
      t.increments('id').primary();
      t.string('name').unique().notNullable();
      t.string('icon');
      t.string('color');
    })
    // Incidents
    .createTable('incidents', t => {
      t.increments('id').primary();
      t.string('incident_id').unique().notNullable();
      t.integer('disaster_type_id').unsigned().references('id').inTable('disaster_types');
      t.string('severity').notNullable(); // critical/high/moderate/low
      t.string('status').defaultTo('reported'); // reported/verified/responding/contained/resolved/closed
      t.string('title').notNullable();
      t.text('description');
      t.float('latitude');
      t.float('longitude');
      t.string('location_name');
      t.string('affected_districts');
      t.string('state');
      t.integer('estimated_affected').defaultTo(0);
      t.integer('casualties').defaultTo(0);
      t.integer('missing_persons').defaultTo(0);
      t.integer('injured').defaultTo(0);
      t.integer('evacuated').defaultTo(0);
      t.integer('reporting_org_id').unsigned().references('id').inTable('organizations');
      t.integer('reported_by').unsigned().references('id').inTable('users');
      t.string('verification_status').defaultTo('submitted'); // submitted/under_verification/verified/rejected
      t.string('response_status').defaultTo('pending'); // pending/teams_assigned/in_progress/completed
      t.timestamp('detected_at');
      t.timestamp('created_at').defaultTo(knex.fn.now());
      t.timestamp('updated_at').defaultTo(knex.fn.now());
    })
    // Incident Updates
    .createTable('incident_updates', t => {
      t.increments('id').primary();
      t.integer('incident_id').unsigned().references('id').inTable('incidents').onDelete('CASCADE');
      t.integer('user_id').unsigned().references('id').inTable('users');
      t.text('update_text').notNullable();
      t.string('update_type').defaultTo('general'); // status_change/info/resource/team/casualty/resolution/general
      t.string('old_value');
      t.string('new_value');
      t.timestamp('created_at').defaultTo(knex.fn.now());
    })
    // Field Reports
    .createTable('field_reports', t => {
      t.increments('id').primary();
      t.string('report_id').unique().notNullable();
      t.integer('incident_id').unsigned().references('id').inTable('incidents');
      t.integer('submitted_by').unsigned().references('id').inTable('users');
      t.string('report_type').notNullable();
      t.string('category');
      t.string('severity');
      t.text('description');
      t.float('latitude');
      t.float('longitude');
      t.string('location_name');
      t.string('district');
      t.string('state');
      t.text('photos');
      t.string('verification_status').defaultTo('submitted');
      t.integer('verified_by').unsigned().references('id').inTable('users');
      t.timestamp('created_at').defaultTo(knex.fn.now());
    })
    // Damage Reports
    .createTable('damage_reports', t => {
      t.increments('id').primary();
      t.integer('incident_id').unsigned().references('id').inTable('incidents');
      t.integer('reported_by').unsigned().references('id').inTable('users');
      t.string('infrastructure_type').notNullable();
      t.string('damage_level').notNullable(); // destroyed/major/moderate/minor
      t.text('description');
      t.float('latitude');
      t.float('longitude');
      t.string('location_name');
      t.string('district');
      t.integer('affected_families').defaultTo(0);
      t.float('estimated_loss').defaultTo(0);
      t.string('status').defaultTo('reported');
      t.text('photos');
      t.timestamp('created_at').defaultTo(knex.fn.now());
      t.timestamp('updated_at').defaultTo(knex.fn.now());
    })
    // Shelters
    .createTable('shelters', t => {
      t.increments('id').primary();
      t.string('name').notNullable();
      t.string('location_name');
      t.string('district');
      t.string('state');
      t.float('latitude');
      t.float('longitude');
      t.integer('capacity').notNullable();
      t.integer('current_occupancy').defaultTo(0);
      t.boolean('food_available').defaultTo(true);
      t.boolean('water_available').defaultTo(true);
      t.boolean('medical_facility').defaultTo(false);
      t.boolean('electricity').defaultTo(true);
      t.integer('toilets').defaultTo(0);
      t.string('contact_person');
      t.string('contact_phone');
      t.string('status').defaultTo('active'); // active/full/closed/preparing
      t.timestamp('created_at').defaultTo(knex.fn.now());
      t.timestamp('updated_at').defaultTo(knex.fn.now());
    })
    // Resources
    .createTable('resources', t => {
      t.increments('id').primary();
      t.string('name').notNullable();
      t.string('type').notNullable();
      t.integer('quantity').defaultTo(0);
      t.integer('available_quantity').defaultTo(0);
      t.text('location');
      t.float('latitude');
      t.float('longitude');
      t.string('status').defaultTo('available');
      t.integer('organization_id').unsigned().references('id').inTable('organizations');
      t.integer('assigned_incident_id').unsigned().references('id').inTable('incidents');
      t.timestamp('created_at').defaultTo(knex.fn.now());
      t.timestamp('updated_at').defaultTo(knex.fn.now());
    })
    // Resource Requests
    .createTable('resource_requests', t => {
      t.increments('id').primary();
      t.integer('incident_id').unsigned().references('id').inTable('incidents');
      t.integer('requested_by').unsigned().references('id').inTable('users');
      t.string('resource_type').notNullable();
      t.integer('quantity').defaultTo(1);
      t.string('urgency').defaultTo('medium');
      t.text('description');
      t.string('status').defaultTo('pending');
      t.integer('assigned_resource_id').unsigned().references('id').inTable('resources');
      t.integer('approved_by').unsigned().references('id').inTable('users');
      t.timestamp('created_at').defaultTo(knex.fn.now());
      t.timestamp('updated_at').defaultTo(knex.fn.now());
    })
    // Response Teams
    .createTable('response_teams', t => {
      t.increments('id').primary();
      t.string('name').notNullable();
      t.string('type').notNullable();
      t.integer('organization_id').unsigned().references('id').inTable('organizations');
      t.integer('members_count').defaultTo(0);
      t.string('specialization');
      t.string('status').defaultTo('available');
      t.text('current_location');
      t.float('latitude');
      t.float('longitude');
      t.string('contact_person');
      t.string('contact_phone');
      t.integer('assigned_incident_id').unsigned().references('id').inTable('incidents');
      t.timestamp('deployed_at');
      t.timestamp('created_at').defaultTo(knex.fn.now());
    })
    // Alerts
    .createTable('alerts', t => {
      t.increments('id').primary();
      t.string('alert_type').notNullable();
      t.string('severity').notNullable();
      t.string('title').notNullable();
      t.text('message');
      t.string('affected_area');
      t.float('latitude');
      t.float('longitude');
      t.float('radius_km');
      t.integer('issued_by').unsigned().references('id').inTable('users');
      t.string('issuing_authority');
      t.string('status').defaultTo('active');
      t.timestamp('start_time');
      t.timestamp('expiry_time');
      t.timestamp('created_at').defaultTo(knex.fn.now());
    })
    // Training Programs
    .createTable('training_programs', t => {
      t.increments('id').primary();
      t.string('title').notNullable();
      t.integer('organization_id').unsigned().references('id').inTable('organizations');
      t.string('trainer_name');
      t.string('location');
      t.float('latitude');
      t.float('longitude');
      t.string('district');
      t.string('state');
      t.integer('disaster_type_id').unsigned().references('id').inTable('disaster_types');
      t.date('training_date');
      t.date('end_date');
      t.integer('participants_count').defaultTo(0);
      t.text('participant_categories');
      t.text('outcome');
      t.text('photos');
      t.text('documents');
      t.timestamp('created_at').defaultTo(knex.fn.now());
    })
    // Notifications
    .createTable('notifications', t => {
      t.increments('id').primary();
      t.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      t.string('category').defaultTo('information');
      t.string('title').notNullable();
      t.text('message');
      t.string('related_type');
      t.integer('related_id');
      t.boolean('is_read').defaultTo(false);
      t.timestamp('created_at').defaultTo(knex.fn.now());
    })
    // Audit Logs
    .createTable('audit_logs', t => {
      t.increments('id').primary();
      t.integer('user_id').unsigned().references('id').inTable('users');
      t.string('action').notNullable();
      t.string('entity_type');
      t.integer('entity_id');
      t.text('details');
      t.string('ip_address');
      t.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('audit_logs')
    .dropTableIfExists('notifications')
    .dropTableIfExists('training_programs')
    .dropTableIfExists('alerts')
    .dropTableIfExists('response_teams')
    .dropTableIfExists('resource_requests')
    .dropTableIfExists('resources')
    .dropTableIfExists('shelters')
    .dropTableIfExists('damage_reports')
    .dropTableIfExists('field_reports')
    .dropTableIfExists('incident_updates')
    .dropTableIfExists('incidents')
    .dropTableIfExists('disaster_types')
    .dropTableIfExists('users')
    .dropTableIfExists('organizations')
    .dropTableIfExists('roles');
};
