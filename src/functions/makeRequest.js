export async function makeRequest({ url, method, token = null, data = null } ) {
    const options = {
        method: method,
        headers: {
            "Content-Type": "application/json",
        }
    }
    if (data) {
        options.body = JSON.stringify(data)
    }

    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(url, options)

    if (!response.ok) {
        const json = await response.json()
        throw { status: json.code, message: json.message };
    }
    
    if (response.status === 204) return response
    
    return response.json()
}