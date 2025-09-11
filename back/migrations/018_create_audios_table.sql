CREATE TABLE audios (
    id SERIAL PRIMARY KEY,
    description VARCHAR(255),
    path TEXT NOT NULL,
    title VARCHAR(100),
    locale VARCHAR(5) NOT NULL
);

CREATE TABLE blog_posts_audios (
    blog_post_id INTEGER REFERENCES blog_posts(id),
    audio_id INTEGER REFERENCES audios(id),
    PRIMARY KEY (blog_post_id, audio_id)
);