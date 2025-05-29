CREATE TABLE works (
    id SERIAL PRIMARY KEY,
    date TIMESTAMP NOT NULL,
    description TEXT NOT NULL,
    title TEXT NOT NULL,
    link TEXT,
    locale VARCHAR(5),
    last_modification TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE works_images (
    work_id INTEGER REFERENCES works(id),
    image_id INTEGER REFERENCES images(id),
    PRIMARY KEY (work_id, image_id)
);

