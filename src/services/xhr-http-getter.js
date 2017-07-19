export default class XhrGetter {

    get(uri, { cancellation, progress } = {}) {

        return new Promise((resolve, reject) => {

            const xhr = new XMLHttpRequest();
            xhr.open('GET', uri);

            xhr.onprogress = progress;
            xhr.onloadstart = progress;
            xhr.onloadend = progress;

            xhr.onerror = () => reject();

            xhr.onload = () => {

                if (cancellation && cancellation.canceled) return reject();

                resolve(JSON.parse(xhr.responseText));

            };

            if (cancellation) cancellation.addListener(() => xhr.abort());

            xhr.send();

        });

    }

}
