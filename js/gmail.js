class Gmail {
    constructor(signedIn) {
        gapi.load("client:auth2", () => {
            gapi.client.init({
                apiKey: atob(JSON.parse(atob("eyJhIjoiUVVsNllWTjVSR0l5YTBNNWJVTkVWMUZaWlhOSFpFbGZhVEZ2UzFVd2RsUnlPVmx6YUdSaiIsImMiOiJNVEE1TXpBM05qRTROelV6TmkxMmFtRmtOV2xtYjI0emFXY3lOV1V3WW1neGFIRjJieloyTUdseGFXUmhheTVoY0hCekxtZHZiMmRzWlhWelpYSmpiMjUwWlc1MExtTnZiUT09In0=")).a),
                clientId: atob(JSON.parse(atob("eyJhIjoiUVVsNllWTjVSR0l5YTBNNWJVTkVWMUZaWlhOSFpFbGZhVEZ2UzFVd2RsUnlPVmx6YUdSaiIsImMiOiJNVEE1TXpBM05qRTROelV6TmkxMmFtRmtOV2xtYjI0emFXY3lOV1V3WW1neGFIRjJieloyTUdseGFXUmhheTVoY0hCekxtZHZiMmRzWlhWelpYSmpiMjUwWlc1MExtTnZiUT09In0=")).c),
                discoveryDocs: [
                    "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"
                ],
                scope: "https://www.googleapis.com/auth/gmail.readonly"
            }).then(function () {
                gapi.auth2.getAuthInstance().isSignedIn.listen(signedIn);
                signedIn(gapi.auth2.getAuthInstance().isSignedIn.get());
            }, function (error) {
                console.log(JSON.stringify(error, null, 2));
            });
        });
    }

    static init(callback) {
        return new Gmail((auth) => {
            callback(auth);
        });
    }

    signIn() {
        return new Promise((resolve, reject) => {
            gapi.auth2.getAuthInstance().signIn().then(() => resolve()).catch(() => reject());
        });
    }

    signOut() {
        gapi.auth2.getAuthInstance().signOut();
    }

    listLabels() {
        return new Promise((resolve, reject) => {
            gapi.client.gmail.users.labels.list({
                userId: "me"
            }).then(res => resolve(res.result.labels)).catch(err => reject(err));
        });
    }

    listLabels() {
        return new Promise((resolve, reject) => {
            gapi.client.gmail.users.labels.list({
                userId: "me"
            }).then(res => resolve(res.result.labels)).catch(err => reject(err));
        });
    }

    listMessages(query) {
        return new Promise((resolve, reject) => {
            gapi.client.gmail.users.messages.list({
                userId: "me",
                q: query
            }).then(res => resolve(res.result.messages)).catch(err => reject(err));
        });
    }

    getMessage(id) {
        return new Promise((resolve, reject) => {
            gapi.client.gmail.users.messages.get({
                userId: "me",
                id
            }).then(res => resolve(res.result)).catch(err => reject(err));
        });
    }
}

window.gm = Gmail;

const gmailInit = function gmailInit() {
    $(() => {
        $(document).trigger("gmailload");
    });
}
