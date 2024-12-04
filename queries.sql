CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE auth_providers (
    auth_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
    provider_uid VARCHAR(255),
    password_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (provider, provider_uid)
);

CREATE TABLE vocab_cards (
    vocab_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    word VARCHAR(100) NOT NULL,
    sentence TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (email, username ) VALUES ('testuserone@gamil.com', 'test_userone');
INSERT INTO vocab_cards (user_id, word, sentence) VALUES 
(1, 'Tell', 'Please tell me the truth.'),
(1, 'Think', 'I think it will rain today.'),
(1, 'Where', 'Do you know where he went?'),
(1, 'Help', 'Can you help me with this?'),
(1, 'Read', 'I love to read before bed.'),
(1, 'Over', 'The game is finally over.');