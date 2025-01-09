/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    pgm.sql(`
      -- Create sequences for tables that require them
      CREATE SEQUENCE IF NOT EXISTS public.users_user_id_seq;
      CREATE SEQUENCE IF NOT EXISTS public.auth_providers_auth_id_seq;
      CREATE SEQUENCE IF NOT EXISTS public.vocab_cards_vocab_id_seq;
  
      -- Create 'users' table first since others depend on it
      CREATE TABLE IF NOT EXISTS public.users (
        user_id integer NOT NULL DEFAULT nextval('public.users_user_id_seq'::regclass),
        email character varying(255) NOT NULL,
        username character varying(50),
        created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT users_pkey PRIMARY KEY (user_id),
        CONSTRAINT users_email_key UNIQUE (email)
      )
      TABLESPACE pg_default;
  
      ALTER TABLE IF EXISTS public.users OWNER TO postgres;
  
      -- Create 'session' table
      CREATE TABLE IF NOT EXISTS public.session (
        sid character varying NOT NULL,
        sess json NOT NULL,
        expire timestamp(6) without time zone NOT NULL,
        CONSTRAINT session_pkey PRIMARY KEY (sid)
      )
      TABLESPACE pg_default;
  
      ALTER TABLE IF EXISTS public.session OWNER TO postgres;
  
      -- Create index on session.expire
      CREATE INDEX IF NOT EXISTS idx_session_expire
        ON public.session USING btree (expire ASC NULLS LAST)
        TABLESPACE pg_default;
  
      -- Create 'auth_providers' table which references 'users'
      CREATE TABLE IF NOT EXISTS public.auth_providers (
        auth_id integer NOT NULL DEFAULT nextval('public.auth_providers_auth_id_seq'::regclass),
        user_id integer NOT NULL,
        provider character varying(50) NOT NULL,
        provider_uid character varying(255),
        password_hash character varying(255),
        created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT auth_providers_pkey PRIMARY KEY (auth_id),
        CONSTRAINT auth_providers_provider_provider_uid_key UNIQUE (provider, provider_uid),
        CONSTRAINT auth_providers_user_id_fkey FOREIGN KEY (user_id)
            REFERENCES public.users (user_id) MATCH SIMPLE
            ON UPDATE NO ACTION
            ON DELETE CASCADE
      )
      TABLESPACE pg_default;
  
      ALTER TABLE IF EXISTS public.auth_providers OWNER TO postgres;
  
      -- Create 'vocab_cards' table which references 'users'
      CREATE TABLE IF NOT EXISTS public.vocab_cards (
        vocab_id integer NOT NULL DEFAULT nextval('public.vocab_cards_vocab_id_seq'::regclass),
        user_id integer NOT NULL,
        word character varying(100) NOT NULL,
        sentence text,
        created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT vocab_cards_pkey PRIMARY KEY (vocab_id),
        CONSTRAINT vocab_cards_user_id_fkey FOREIGN KEY (user_id)
            REFERENCES public.users (user_id) MATCH SIMPLE
            ON UPDATE NO ACTION
            ON DELETE CASCADE
      )
      TABLESPACE pg_default;
  
      ALTER TABLE IF EXISTS public.vocab_cards OWNER TO postgres;
    `);
};


/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.sql(`
      -- Drop dependent tables first
      DROP TABLE IF EXISTS public.vocab_cards;
      DROP SEQUENCE IF EXISTS public.vocab_cards_vocab_id_seq;
  
      DROP TABLE IF EXISTS public.auth_providers;
      DROP SEQUENCE IF EXISTS public.auth_providers_auth_id_seq;
  
      -- Drop index associated with session table
      DROP INDEX IF EXISTS public.idx_session_expire;
  
      DROP TABLE IF EXISTS public.session;
  
      -- Finally, drop the users table and its sequence
      DROP TABLE IF EXISTS public.users;
      DROP SEQUENCE IF EXISTS public.users_user_id_seq;
    `);
};
