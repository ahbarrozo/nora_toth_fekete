import { writeFileSync } from 'fs';
import { fail, redirect, type Actions, type ServerLoad } from '@sveltejs/kit';
import type { ApiData, PageData } from 'src/types/PageData.types';

import { API_ENDPOINT } from '$env/static/private';

type DataTableName = keyof ApiData;

export const actions: Actions = {
    deleteAboutSection: async ({ request, cookies, fetch }) => {
        try {
            const formData = await request.formData();
            const token = cookies.get('token');

            if (!token) {
                return { success: false, error: 'Unauthorized: no token found' };
            }

            const id = formData.get('id');
            const response = await fetch(API_ENDPOINT + `about_sections/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            const result = await response.json();

            if (result.error)
                // @ts-ignore
                return fail(400, 'Invalid or expired token')
            return { success: true, data: result };
        } catch (error) {
            return fail(500, { success: false, error });
        }
    },
    deleteWork: async ({ request, cookies, fetch }) => {
        try {
            const formData = await request.formData();
            const token = cookies.get('token');

            if (!token) {
                return { success: false, error: 'Unauthorized: no token found' };
            }

            const id = formData.get('id');
            const response = await fetch(API_ENDPOINT + `works/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            const result = await response.json();

            if (result.error)
                // @ts-ignore
                return fail(400, 'Invalid or expired token')
            return { success: true, data: result };
        } catch (error) {
            return fail(500, { success: false, error });
        }
    },
    deleteBlogPost: async ({ request, cookies, fetch }) => {
        try {
            const formData = await request.formData();
            const token = cookies.get('token');

            if (!token) {
                return { success: false, error: 'Unauthorized: no token found' };
            }

            const id = formData.get('id');
            const response = await fetch(API_ENDPOINT + `blog_posts/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            const result = await response.json();

            if (result.error)
                // @ts-ignore
                return fail(400, 'Invalid or expired token')
            return { success: true, data: result };
        } catch (error) {
            return fail(500, { success: false, error });
        }
    },
    deleteContact: async ({ request, cookies, fetch }) => {
        try {
            const formData = await request.formData();
            const token = cookies.get('token');

            if (!token) {
                return { success: false, error: 'Unauthorized: no token found' };
            }

            const id = formData.get('id');
            const response = await fetch(API_ENDPOINT + `contacts/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            const result = await response.json();

            if (result.error)
                // @ts-ignore
                return fail(400, 'Invalid or expired token')
            return { success: true, data: result };
        } catch (error) {
            return fail(500, { success: false, error });
        }
    },
    deleteEvent: async ({ request, cookies, fetch }) => {
        try {
            const formData = await request.formData();
            const token = cookies.get('token');

            if (!token) {
                return { success: false, error: 'Unauthorized: no token found' };
            }

            const id = formData.get('id');
            const response = await fetch(API_ENDPOINT + `events/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            const result = await response.json();

            if (result.error)
                // @ts-ignore
                return fail(400, 'Invalid or expired token')
            return { success: true, data: result };
        } catch (error) {
            return fail(500, { success: false, error });
        }
    },
    deleteSocialMedia: async ({ request, cookies, fetch }) => {
        try {
            const formData = await request.formData();
            const token = cookies.get('token');

            if (!token) {
                return { success: false, error: 'Unauthorized: no token found' };
            }

            const id = formData.get('id');
            const response = await fetch(API_ENDPOINT + `social_media/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            const result = await response.json();

            if (result.error)
                // @ts-ignore
                return fail(400, 'Invalid or expired token')
            return { success: true, data: result };
        } catch (error) {
            return fail(500, { success: false, error });
        }
    },
    saveAboutSection: async ({ request, cookies, fetch }) => {
        try {
            const formData = await request.formData();
            const token = cookies.get('token');

            if (!token) {
                return { success: false, error: 'Unauthorized: no token found' };
            }

            const response = await fetch(API_ENDPOINT + 'about_sections', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            const result = await response.json();

            if (result.error)
                // @ts-ignore
                return fail(400, 'Invalid or expired token')
            return { success: true, data: result };
        } catch (error) {
            return fail(500, { success: false, error });
        }
    },
    saveWork: async ({ request, cookies, fetch }) => {
        try {
            const formData = await request.formData();
            const token = cookies.get('token');

            if (!token) {
                return { success: false, error: 'Unauthorized: no token found' };
            }

            const response = await fetch(API_ENDPOINT + 'works', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            const result = await response.json();

            if (result.error)
                // @ts-ignore
                return fail(400, 'Invalid or expired token')
            return { success: true, data: result };
        } catch (error) {
            return fail(500, { success: false, error });
        }
    },
    saveBlogPost: async ({ request, cookies, fetch }) => {
        try {
            const formData = await request.formData();
            const token = cookies.get('token');

            if (!token) {
                return { success: false, error: 'Unauthorized: no token found' };
            }

            const response = await fetch(API_ENDPOINT + 'blog_posts', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            const result = await response.json();

            if (result.error)
                // @ts-ignore
                return fail(400, 'Invalid or expired token')
            return { success: true, data: result };
        } catch (error) {
            return fail(500, { success: false, error });
        }
    },
    saveContact: async ({ request, cookies, fetch }) => {
        try {
            const formData = await request.formData();
            const token = cookies.get('token');

            if (!token) {
                return { success: false, error: 'Unauthorized: no token found' };
            }

            const response = await fetch(API_ENDPOINT + 'contacts', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            const result = await response.json();

            if (result.error)
                // @ts-ignore
                return fail(400, 'Invalid or expired token')
            return { success: true, data: result };
        } catch (error) {
            return fail(500, { success: false, error });
        }
    },
    saveEvent: async ({ request, cookies, fetch }) => {
        try {
            const formData = await request.formData();
            const token = cookies.get('token');

            if (!token) {
                return { success: false, error: 'Unauthorized: no token found' };
            }
            const response = await fetch(API_ENDPOINT + 'events', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            const result = await response.json();
            if (result.error)
                // @ts-ignore
                return fail(400, 'Invalid or expired token')
            return { success: true, data: result };
        } catch (error) {
            return fail(500, { success: false, error });
        }
    },
    saveSocialMedia: async ({ request, cookies, fetch }) => {
        try {
            const formData = await request.formData();
            const token = cookies.get('token');

            if (!token) {
                return { success: false, error: 'Unauthorized: no token found' };
            }

            const response = await fetch(API_ENDPOINT + 'social_media', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            const result = await response.json();

            if (result.error)
                // @ts-ignore
                return fail(400, 'Invalid or expired token')
            return { success: true, data: result };
        } catch (error) {
            return fail(500, { success: false, error });
        }
    },
    updateAboutSection: async ({ request, cookies, fetch }) => {
        try {
            const formData = await request.formData();
            const token = cookies.get('token');

            if (!token) {
                return { success: false, error: 'Unauthorized: no token found' };
            }

            const id = formData.get('id');
            const response = await fetch(API_ENDPOINT + `about_sections/${id}`, {
                method: 'PUT',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            const result = await response.json();

            if (result.error)
                // @ts-ignore
                return fail(400, 'Invalid or expired token')
            return { success: true, data: result };
        } catch (error) {
            return fail(500, { success: false, error });
        }
    },
    updateWork: async ({ request, cookies, fetch }) => {
        try {
            const formData = await request.formData();
            const token = cookies.get('token');

            if (!token) {
                return { success: false, error: 'Unauthorized: no token found' };
            }

            const id = formData.get('id');
            const response = await fetch(API_ENDPOINT + `works/${id}`, {
                method: 'PUT',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            const result = await response.json();
            if (result.error)
                // @ts-ignore
                return fail(400, 'Invalid or expired token')
            return { success: true, data: result };
        } catch (error) {
            return fail(500, { success: false, error });
        }
    },
    updateBlogPost: async ({ request, cookies, fetch }) => {
        try {
            const formData = await request.formData();
            const token = cookies.get('token');

            if (!token) {
                return { success: false, error: 'Unauthorized: no token found' };
            }

            const id = formData.get('id');
            const response = await fetch(API_ENDPOINT + `blog_posts/${id}`, {
                method: 'PUT',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            const result = await response.json();
            if (result.error)
                // @ts-ignore
                return fail(400, 'Invalid or expired token')
            return { success: true, data: result };
        } catch (error) {
            return fail(500, { success: false, error });
        }
    },
    updateContact: async ({ request, cookies, fetch }) => {
        try {
            const formData = await request.formData();
            const token = cookies.get('token');

            if (!token) {
                return { success: false, error: 'Unauthorized: no token found' };
            }

            const id = formData.get('id');
            const response = await fetch(API_ENDPOINT + `contacts/${id}`, {
                method: 'PUT',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            const result = await response.json();
            if (result.error)
                // @ts-ignore
                return fail(400, 'Invalid or expired token')
            return { success: true, data: result };
        } catch (error) {
            return fail(500, { success: false, error });
        }
    },
    updateEvent: async ({ request, cookies, fetch }) => {
        try {
            const formData = await request.formData();
            const token = cookies.get('token');

            if (!token) {
                return { success: false, error: 'Unauthorized: no token found' };
            }
            const id = formData.get('id');
            const response = await fetch(API_ENDPOINT + `events/${id}`, {
                method: 'PUT',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            const result = await response.json();
            if (result.error)
                // @ts-ignore
                return fail(400, 'Invalid or expired token')
            return { success: true, data: result };
        } catch (error) {
            return fail(500, { success: false, error });
        }
    },
    updateSocialMedia: async ({ request, cookies, fetch }) => {
        try {
            const formData = await request.formData();
            const token = cookies.get('token');

            if (!token) {
                return { success: false, error: 'Unauthorized: no token found' };
            }

            const id = formData.get('id');
            const response = await fetch(API_ENDPOINT + `social_media/${id}`, {
                method: 'PUT',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            const result = await response.json();
            if (result.error)
                // @ts-ignore
                return fail(400, 'Invalid or expired token')
            return { success: true, data: result };
        } catch (error) {
            return fail(500, { success: false, error });
        }
    },
    uploadImage: async ({ request }) => {
        try {
            const formData = await request.formData();
            const file = formData.get('image');
            if (!(file instanceof Object) || !file.name) {
                return fail(400, { missing: true });
            }

            const buffer = Buffer.from(await file.arrayBuffer());
            const uploadPath = process.env.NODE_ENV === 'production' ?
                '/apps/front/build/client/images' :
                'static/images'
            writeFileSync(`${uploadPath}/${file.name}`, buffer, "base64");
            return { success: true, data: file.name };
        } catch (error) {
            return fail(500, { success: false, error })
        }
    },
};

export const load: ServerLoad = async ({ cookies, fetch }): Promise<PageData> => {
    const token = cookies.get('token');
    if (!token) {
        redirect(303, '/');
    }

    const formData = new FormData();
    formData.append('token', token);
    const response = await fetch(API_ENDPOINT + 'auth/verify_token',
        {
            method: 'POST',
            body: formData
        }
    );
    const responseData = await response.json();

    if (responseData.error)
        redirect(303, '/');

    try {
        const dataTables: DataTableName[] = [
            'about_sections',
            'blog_posts',
            'contacts',
            'events',
            'social_media',
            'works'
        ];

        // Create an array of promise-returning API call functions
        const apiCalls = dataTables.map(dt => fetch(API_ENDPOINT + dt));

        // Wait for all promises to resolve
        const responses = await Promise.all(apiCalls);

        // Process all responses
        const results = await Promise.all(responses.map(response => response.json()));
        const apiData: ApiData = dataTables.reduce((acc: ApiData, table: DataTableName, i) => {
            acc[table] = results[i];
            return acc;
        }, {} as ApiData);

        return {
            apiData
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};
