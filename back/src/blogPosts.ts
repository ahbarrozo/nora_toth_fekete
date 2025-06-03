import { Hono } from 'hono';
import { Pool } from 'pg';
import { AppVariables } from './types/hono.types';
import { Image, ImageDTO } from './types/Image.type';
import { BlogPost, BlogPostDTO } from './types/BlogPost.type';
import { authGuard } from './auth';

const blogPosts = new Hono<{ Variables: AppVariables }>();

/**
 *  GET all blog posts while joining all the images associated
 *  with them and ordering by post date. A locale query is possible
 *  to filter results based on the locale. Then the result is
 *  parsed to include all images in a single array inside the
 *  images attribute.
 */
blogPosts.get('/', async (c) => {
    const pool: Pool = c.get('db');
    const query = c.req.query('locale');
    const andClause: string = query
        ? `AND im.locale = '${query}' `
        : '';
    const whereClause: string = query
        ? `WHERE bp.locale = '${query}'`
        : '';

    try {
        const result = await pool.query(`
            SELECT 
                bp.id, bp.date, bp.title, bp.subtitle, 
                bp.text, bp.locale, bp.post_num,
                im.id AS image_id, im.path AS image_path,
                im.title AS image_title, im.locale AS image_locale, 
                im.description AS image_description 
            FROM 
                blog_posts bp
            LEFT JOIN
                blog_posts_images bpi ON bp.id = bpi.blog_post_id
            LEFT JOIN
                images im ON bpi.image_id = im.id ${andClause}
            ${whereClause} 
            ORDER BY
                bp.date
            DESC;
        `);

        const blogPosts = result.rows.reduce((rows, row) => {
            const image: Image | null = row.image_id
                ? {
                    id: row.image_id,
                    description: row.image_description,
                    path: row.image_path,
                    title: row.image_title,
                    locale: row.image_locale
                }
                : null;

            const existingBlogPost: BlogPost = rows.find((r: BlogPost) => r.id === row.id);

            if (existingBlogPost) {
                if (image) existingBlogPost.images.push(image);
            } else {
                const blogPost: BlogPost = {
                    id: row.id,
                    postNum: row.post_num,
                    title: row.title,
                    subtitle: row.subtitle,
                    text: row.text,
                    date: row.date,
                    locale: row.locale,
                    images: []
                };

                if (image) blogPost.images.push(image);

                rows.push(blogPost);
            }
            return rows;
        }, []);

        return c.json(blogPosts, 200);
    } catch (error) {
        console.error('Database error: ', error);
        return c.json({ error: 'Failed to fetch blog_posts.' }, 500);
    }
});

/**
 *  POST request to create a new blog entry. It will insert the
 *  new rows at the blog_posts, blog_post_images and images tables
 */
blogPosts.post('/', authGuard, async (c) => {
    const pool: Pool = c.get('db');

    try {
        const data = await c.req.formData();
        const blogPost: BlogPostDTO = {
            postNum: parseInt(data.get('postNum')!.toString()),
            title: data.get('title')!.toString(),
            subtitle: data.get('subtitle')! && data.get('subtitle')!.toString(), // nullable field
            text: data.get('text')!.toString(),
            locale: data.get('locale')!.toString()
        };
        const images: ImageDTO[] = JSON.parse(data.get('images')!.toString());

        const blogPostQuery = await pool.query(`
            INSERT INTO 
                blog_posts (title, subtitle, text, locale, post_num) 
            VALUES 
                ($1, $2, $3, $4, $5)
            RETURNING 
                id;`,
            [blogPost.title, blogPost.subtitle, blogPost.text, blogPost.locale, blogPost.postNum]);
        const blogPostId = blogPostQuery.rows[0].id;
        const resultImagesPromises = images.map(async (image) => {
            const resultImage = await pool.query(`
                INSERT INTO 
                    images (path, description, title, locale)
                VALUES 
                    ($1, $2, $3, $4)
                RETURNING 
                    id;`,
                [image.path, image.description, image.title, image.locale]
            );

            return resultImage.rows[0].id;
        });

        const resultImages = await Promise.all(resultImagesPromises);

        await Promise.all(
            resultImages.map(async (imageId) => {
                await pool.query(`
                    INSERT INTO 
                        blog_posts_images (blog_post_id, image_id)
                    VALUES 
                        ($1, $2);`,
                    [blogPostId, imageId]
                );
            })
        );

        return c.json(resultImages, 201);
    } catch (error) {
        console.error('Database error: ', error);
        return c.json({ error: 'Failed to insert new blog content into DB' }, 500);
    }
});

/**
 *  PUT request to update a blog entry based on its ID. It will
 *  check its existence, fetch images associated with it, and update
 *  all the fields available at the submission form, images included,
 *  if needed
 */
blogPosts.put('/:id', authGuard, async (c) => {
    const pool: Pool = c.get('db');
    const id = c.req.param('id');
    const data = await c.req.formData();
    const blogPost: BlogPostDTO = {
        title: data.get('title')!.toString(),
        subtitle: data.get('subtitle')! && data.get('subtitle')!.toString(), // nullable field
        text: data.get('text')!.toString(),
        locale: data.get('locale')!.toString()
    };
    const images: ImageDTO[] = JSON.parse(data.get('images')!.toString());

    try {
        const checkBlogPost = await pool.query(`
            SELECT 
                id 
            FROM 
                blog_posts 
            WHERE 
                id = $1;`,
            [id]
        );

        if (checkBlogPost.rows.length === 0) {
            return c.json({ error: 'Blog post not found' }, 404);
        }

        await pool.query(`
            UPDATE 
                blog_posts
            SET 
                title = $1, subtitle = $2, text = $3, locale = $4
            WHERE 
                id = $5;`,
            [blogPost.title, blogPost.subtitle, blogPost.text, blogPost.locale, id]
        );

        const blogPostsImagesResults = await pool.query(
            `
            SELECT 
                bpi.image_id, bpi.blog_post_id, 
                im.id, im.path, im.description, im.title 
            FROM 
                blog_posts_images bpi
            LEFT JOIN 
                images im ON im.id = bpi.image_id
            WHERE 
                bpi.blog_post_id = $1;`,
            [id]
        );

        // separating between images to be deleted and upserted
        const imagesToDelete = blogPostsImagesResults.rows.filter(
            (im) => !images.map((i) => i.id).includes(im.image_id)
        );
        const imagesToUpsert = images.filter(
            (im) => !im.id || !imagesToDelete.map((i) => i.id).includes(im.id)
        );

        await Promise.all(
            imagesToDelete.map(async (im) => {
                await pool.query(`
                    DELETE FROM 
                        blog_posts_images 
                    WHERE 
                        blog_post_id = $1 AND image_id = $2`,
                    [id, im.id]);
            })
        );

        // Check among images to insert if for no given ID. Else, update
        await Promise.all(
            imagesToUpsert.map(async (image) => {
                if (!image.id) {
                    const result = await pool.query(`
                        INSERT INTO 
                            images (path, description, title, locale)
                        VALUES 
                            ($1, $2, $3, $4)
                        RETURNING 
                            id;`,
                        [image.path, image.description, image.title, image.locale]
                    );

                    await pool.query(`
                        INSERT INTO 
                            blog_post_images (blog_post_id, image_id) 
                        VALUES
                            ($1, $2);`,
                        [id, result.rows[0].id]
                    );
                } else {
                    await pool.query(`
                        UPDATE 
                            images 
                        SET 
                            path = $1, description = $2, title = $3, locale = $4   
                        WHERE 
                            id = $5;`,
                        [image.path, image.description, image.title, image.locale, image.id]
                    );
                }

            })
        );

        return c.json({ message: `Blog post ${id} updated successfully` }, 200);
    } catch (error) {
        console.error('Database error: ', error);
        return c.json({ error: 'Failed to update blog content into DB' }, 500);
    }
});

blogPosts.delete('/:id', authGuard, async (c) => {
    const pool: Pool = c.get('db');
    const id = c.req.param('id');

    try {
        const checkBlogPost = await pool.query(`
            SELECT 
                id 
            FROM 
                blog_posts 
            WHERE 
                id = $1;`,
            [id]
        );

        if (checkBlogPost.rows.length === 0) {
            return c.json({ error: 'Blog post not found' }, 404);
        }

        const checkBlogPostImages = await pool.query(`
            SELECT 
                blog_post_id 
            FROM 
                blog_posts_images 
            WHERE 
                blog_post_id = $1;`,
            [id]
        );


        if (checkBlogPostImages.rows.length > 0) {
            await pool.query(`
                DELETE FROM 
                    blog_posts_images 
                WHERE 
                    blog_post_id = $1`,
                [id]
            );
        }

        await pool.query(`
            DELETE FROM 
                blog_posts 
            WHERE 
                id = $1`,
            [id]
        );

        return c.json(
            {
                message: 'Blog post deleted successfully',
                id
            },
            200
        );
    } catch (error) {
        console.error('Error deleting blog post: ', error);
        return c.json({ error: 'Failed to delete blog post' }, 500);
    }
});

export default blogPosts;
