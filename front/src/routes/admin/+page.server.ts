import { writeFileSync } from 'fs';
import { fail, redirect, type Actions, type ServerLoad } from '@sveltejs/kit';
import type { ApiData, PageData } from 'src/types/PageData.types';

import { PUBLIC_API_ENDPOINT } from '$env/static/public';

type DataTableName = keyof ApiData;

export const actions: Actions = {
    deleteAboutSection: async ({ request, fetch }) => {
        try {
            const formData = await request.formData();
            const id = formData.get('id');
            const response = await fetch(PUBLIC_API_ENDPOINT + `about_sections/${id}`, {
                method: 'DELETE',
            });

            const result = await response.json();

            if (result.error)
                // @ts-ignore
                return fail(500, `Internal server error: ${result.error}`)
            return { success: true, data: result };
        } catch (error) {
            return fail(500, { success: false, error });
        }
    },
    deleteWork: async ({ request, fetch }) => {
        try {
            const formData = await request.formData();
            const id = formData.get('id');
            const response = await fetch(PUBLIC_API_ENDPOINT + `works/${id}`, {
                method: 'DELETE',
            });
            const result = await response.json();

            if (result.error)
                // @ts-ignore
                return fail(500, `Internal server error: ${result.error}`)
            return { success: true, data: result };
        } catch (error) {
            return fail(500, { success: false, error });
        }
    },
    deleteBlogPost: async ({ request, fetch }) => {
        try {
            const formData = await request.formData();


            const id = formData.get('id');
            const response = await fetch(PUBLIC_API_ENDPOINT + `blog_posts/${id}`, {
                method: 'DELETE',
            });
            const result = await response.json();

            if (result.error)
                // @ts-ignore
                return fail(500, `Internal server error: ${result.error}`)
            return { success: true, data: result };
        } catch (error) {
            return fail(500, { success: false, error });
        }
    },
    deleteContact: async ({ request, fetch }) => {
        try {
            const formData = await request.formData();


            const id = formData.get('id');
            const response = await fetch(PUBLIC_API_ENDPOINT + `contacts/${id}`, {
                method: 'DELETE',
            });
            const result = await response.json();

            if (result.error)
                // @ts-ignore
                return fail(500, `Internal server error: ${result.error}`)
            return { success: true, data: result };
        } catch (error) {
            return fail(500, { success: false, error });
        }
    },
    deleteEvent: async ({ request, fetch }) => {
        try {
            const formData = await request.formData();


            const id = formData.get('id');
            const response = await fetch(PUBLIC_API_ENDPOINT + `events/${id}`, {
                method: 'DELETE',
            });
            const result = await response.json();

            if (result.error)
                // @ts-ignore
                return fail(500, `Internal server error: ${result.error}`)
            return { success: true, data: result };
        } catch (error) {
            return fail(500, { success: false, error });
        }
    },
    deleteSocialMedia: async ({ request, fetch }) => {
        try {
            const formData = await request.formData();


            const id = formData.get('id');
            const response = await fetch(PUBLIC_API_ENDPOINT + `social_media/${id}`, {
                method: 'DELETE',
            });
            const result = await response.json();

            if (result.error)
                // @ts-ignore
                return fail(500, `Internal server error: ${result.error}`)
            return { success: true, data: result };
        } catch (error) {
            return fail(500, { success: false, error });
        }
    },
    saveAboutSection: async ({ request, fetch }) => {
        try {
            const formData = await request.formData();


            const response = await fetch(PUBLIC_API_ENDPOINT + 'about_sections', {
                method: 'POST',
                body: formData,
            });
            const result = await response.json();

            if (result.error)
                // @ts-ignore
                return fail(500, `Internal server error: ${result.error}`)
            return { success: true, data: result };
        } catch (error) {
            return fail(500, { success: false, error });
        }
    },
    saveWork: async ({ request, fetch }) => {
        try {
            const formData = await request.formData();


            const response = await fetch(PUBLIC_API_ENDPOINT + 'works', {
                method: 'POST',
                body: formData,
            });
            const result = await response.json();

            if (result.error)
                // @ts-ignore
                return fail(500, `Internal server error: ${result.error}`)
            return { success: true, data: result };
        } catch (error) {
            return fail(500, { success: false, error });
        }
    },
    saveBlogPost: async ({ request, fetch }) => {
        try {
            const formData = await request.formData();


            const response = await fetch(PUBLIC_API_ENDPOINT + 'blog_posts', {
                method: 'POST',
                body: formData,
            });
            const result = await response.json();

            if (result.error)
                // @ts-ignore
                return fail(500, `Internal server error: ${result.error}`)
            return { success: true, data: result };
        } catch (error) {
            return fail(500, { success: false, error });
        }
    },
    saveContact: async ({ request, fetch }) => {
        try {
            const formData = await request.formData();


            const response = await fetch(PUBLIC_API_ENDPOINT + 'contacts', {
                method: 'POST',
                body: formData,
            });
            const result = await response.json();

            if (result.error)
                // @ts-ignore
                return fail(500, `Internal server error: ${result.error}`)
            return { success: true, data: result };
        } catch (error) {
            return fail(500, { success: false, error });
        }
    },
    saveEvent: async ({ request, fetch }) => {
        try {
            const formData = await request.formData();

            const response = await fetch(PUBLIC_API_ENDPOINT + 'events', {
                method: 'POST',
                body: formData,
            });
            const result = await response.json();
            if (result.error)
                // @ts-ignore
                return fail(500, `Internal server error: ${result.error}`)
            return { success: true, data: result };
        } catch (error) {
            return fail(500, { success: false, error });
        }
    },
    saveSocialMedia: async ({ request, fetch }) => {
        try {
            const formData = await request.formData();


            const response = await fetch(PUBLIC_API_ENDPOINT + 'social_media', {
                method: 'POST',
                body: formData,
            });
            const result = await response.json();

            if (result.error)
                // @ts-ignore
                return fail(500, `Internal server error: ${result.error}`)
            return { success: true, data: result };
        } catch (error) {
            return fail(500, { success: false, error });
        }
    },
    updateAboutSection: async ({ request, fetch }) => {
        try {
            const formData = await request.formData();


            const id = formData.get('id');
            const response = await fetch(PUBLIC_API_ENDPOINT + `about_sections/${id}`, {
                method: 'PUT',
                body: formData,
            });
            const result = await response.json();

            if (result.error)
                // @ts-ignore
                return fail(500, `Internal server error: ${result.error}`)
            return { success: true, data: result };
        } catch (error) {
            return fail(500, { success: false, error });
        }
    },
    updateWork: async ({ request, fetch }) => {
        try {
            const formData = await request.formData();


            const id = formData.get('id');
            const response = await fetch(PUBLIC_API_ENDPOINT + `works/${id}`, {
                method: 'PUT',
                body: formData,
            });
            const result = await response.json();
            if (result.error)
                // @ts-ignore
                return fail(500, `Internal server error: ${result.error}`)
            return { success: true, data: result };
        } catch (error) {
            return fail(500, { success: false, error });
        }
    },
    updateBlogPost: async ({ request, fetch }) => {
        try {
            const formData = await request.formData();


            const id = formData.get('id');
            const response = await fetch(PUBLIC_API_ENDPOINT + `blog_posts/${id}`, {
                method: 'PUT',
                body: formData,
            });
            const result = await response.json();
            if (result.error)
                // @ts-ignore
                return fail(500, `Internal server error: ${result.error}`)
            return { success: true, data: result };
        } catch (error) {
            return fail(500, { success: false, error });
        }
    },
    updateContact: async ({ request, fetch }) => {
        try {
            const formData = await request.formData();
            const id = formData.get('id');
            const response = await fetch(PUBLIC_API_ENDPOINT + `contacts/${id}`, {
                method: 'PUT',
                body: formData,
            });
            const result = await response.json();
            if (result.error)
                // @ts-ignore
                return fail(500, `Internal server error: ${result.error}`)
            return { success: true, data: result };
        } catch (error) {
            return fail(500, { success: false, error });
        }
    },
    updateEvent: async ({ request, fetch }) => {
        try {
            const formData = await request.formData();
            const id = formData.get('id');
            const response = await fetch(PUBLIC_API_ENDPOINT + `events/${id}`, {
                method: 'PUT',
                body: formData,
            });
            const result = await response.json();
            if (result.error)
                // @ts-ignore
                return fail(500, `Internal server error: ${result.error}`)
            return { success: true, data: result };
        } catch (error) {
            return fail(500, { success: false, error });
        }
    },
    updateSocialMedia: async ({ request, fetch }) => {
        try {
            const formData = await request.formData();


            const id = formData.get('id');
            const response = await fetch(PUBLIC_API_ENDPOINT + `social_media/${id}`, {
                method: 'PUT',
                body: formData,
            });
            const result = await response.json();
            if (result.error)
                // @ts-ignore
                return fail(500, `Internal server error: ${result.error}`)
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

export const load: ServerLoad = async ({ fetch }): Promise<PageData> => {
    const response = await fetch(PUBLIC_API_ENDPOINT + 'auth/verify',
        {
            method: 'GET',
        }
    );
    const responseData = await response.json();

    if (!responseData.isAuthenticated)
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
        const apiCalls = dataTables.map(dt => fetch(PUBLIC_API_ENDPOINT + dt));

        // Wait for all promises to resolve
        const responses = await Promise.all(apiCalls);
        const googleCalendarResponse = await fetch(PUBLIC_API_ENDPOINT + 'events/google-calendar');
        const googleCalendar = await googleCalendarResponse.json();

        // Process all responses
        const results = await Promise.all(responses.map(response => response.json()));
        const apiData: ApiData = dataTables.reduce((acc: ApiData, table: DataTableName, i) => {
            acc[table] = results[i];
            return acc;
        }, {} as ApiData);

        const lastEventId = apiData.events[apiData.events.length - 1].id!;
        const calendarEvents = googleCalendar.events.map((e: any, i: number) => {
            return {
                id: lastEventId + i + 1,
                name: e.summary,
                dates: [
                    {
                        start: e.start.dateTime,
                        stop: e.end.dateTime
                    }
                ],
                type: 'external'
            }
        })
        apiData['events'].push(...calendarEvents)

        return {
            apiData
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};
