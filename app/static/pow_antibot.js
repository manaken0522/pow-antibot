let xhr = new XMLHttpRequest();
xhr.open('GET', '/pow_antibot');
xhr.onload = () => {
    let work_state_element =  document.body.getElementsByClassName('work_state')[0];

    if (xhr.readyState === xhr.DONE) {
        if (xhr.status === 200) {
            let data = JSON.parse(xhr.responseText);

            document.body.appendChild(document.createTextNode(`Hash: ${data['hash']}`));
            document.body.appendChild(document.createElement('br'));
            document.body.appendChild(document.createTextNode(`Length: ${data['length']}`));
            document.body.appendChild(document.createElement('br'));
            document.body.appendChild(document.createTextNode(`Session ID: ${data['session_id']}`));

            work_state_element.innerHTML = 'Running...';

            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
            let finished = false;
            while(finished === false) {
                setTimeout(() => {
                    let random_string = '';

                    for (let i=0; i<data['length']; i++) {
                        random_string += characters[Math.floor(Math.random() * characters.length)];
                    }

                    if(data['hash'] !== sha256(random_string)) {
                        work_state_element.innerHTML = 'Finished';
                        document.body.appendChild(document.createElement('br'));
                        document.body.appendChild(document.createTextNode(random_string));
                        finished = true;
                    }
                    resolve();
                }, 1000);
            }
        }
        else {
            work_state_element.innerHTML = 'Failed';
        }
    }
};

xhr.send();