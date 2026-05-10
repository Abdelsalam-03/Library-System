const SERVER_URL = "http://127.0.0.1:8000"

export async function customFetch(path, options = {}){
    if(path[0] != '/') path = '/' + path;

    const accessToken = localStorage.getItem("access");

    options.headers = {
        ...options.headers,
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
    }


    let response = await fetch(SERVER_URL+path, options);

    if(response.status == 401){
        const refreshToken = localStorage.getItem("refresh");

        if(refreshToken){
            const refreshRes = await fetch(SERVER_URL + '/api/auth/refresh/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh: refreshToken })
            })

            if(refreshRes.ok){
                const data = await refreshRes.json();
                localStorage.setItem('access', data.access);

                options.headers['Authorization'] = `Bearer ${data.access}`;
                response = await fetch(SERVER_URL+path, options);
            }else{
                localStorage.clear();
                window.location.href = '/pages/auth/login.html';
            }
        }else{
            localStorage.clear();
            window.location.href = '/pages/auth/login.html';
        }
    }

    return response;
}


export function parseErrors(errors) {
    let messages = [];

    if (errors?.detail) {
        messages.push(errors.detail);
    } else {
        for (const key in errors) {
            const value = errors[key];
            if (Array.isArray(value)) {
                messages.push(`${key}: ${value.join(', ')}`);
            } else if (typeof value === 'string') {
                messages.push(value);
            } else {
                messages = messages.concat(parseErrors(value));
            }
        }
    }
    return messages;
}