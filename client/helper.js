/* Takes in an error message. Sets the error message up in html, and
   displays it to the user. Will be hidden by other events that could
   end in an error.
*/
const handleError = (message) => {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('messageDiv').classList.remove('hidden');
    document.getElementById('messageDiv').classList.add('flex');
    document.getElementById('messageDiv').classList.add('items-center');
    document.getElementById('messageDiv').classList.add('justify-center');

};

/* Sends post requests to the server using fetch. Will look for various
   entries in the response JSON object, and will handle them appropriately.
*/
const sendPost = async (url, data, handler) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();
    document.getElementById('messageDiv').classList.add('hidden');

    if (result.redirect) {
        window.location = result.redirect;
    }

    if (result.error) {
        handleError(result.error);
    }

    if (handler) {
        handler(result);
    } else
        return result;
};

const sendGet = async (url, handler) => {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        },
    });

    const result = await response.json();

    if (handler)
        handler(result);
    else
        return result;
};

const hideError = () => {
    document.getElementById('messageDiv').classList.add('hidden');
};

module.exports = {
    handleError,
    sendPost,
    sendGet,
    hideError,
};