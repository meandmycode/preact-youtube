export default class NodeHttpGetter {

    constructor(requester) {
        this.requester = requester;
    }

    get(uri, { cancellation } = {}) {

        return new Promise((resolve, reject) => {

            const req = this.requester(uri, (err, res, body) => {

                if (cancellation && cancellation.canceled) return reject();

                if (err) return reject(err);

                resolve(JSON.parse(body));

            });

            if (cancellation) cancellation.addListener(() => req.abort());

        });

    }
}
