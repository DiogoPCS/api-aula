const functions = require('firebase-functions');

admin = require('firebase-admin');

express = require('express');

cors = require('cors');

app = express();

app.use(cors({ origin: true }));

var serviceAccount = require("./ChaveAcesso.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://projetotestefirebase-568fd.firebaseio.com"
});

const db = admin.firestore();


// CASA
    // Read All
    app.get('/casa', (req, res) => {
        (async () => {
            try {
                let query = db.collection('casa');
                let response = [];

                await query.get().then(querySnapshot => {
                    let docs = querySnapshot.docs;
                    for (let doc of docs) {
                        const selectedItem = {
                            id: doc.id,
                            casa: doc.data()
                        };
                        response.push(selectedItem);
                    }
                });

                return res.status(200).send(response);
            } catch (error) {
                console.log(error);
                return res.status(500).send(error);
            }
        })();
    });

    // Read Proprietario
    app.get('/casa/:proprietario', (req, res) => {
        (async () => {
            try {
                const document = db.collection('casa').doc(req.params.proprietario);
                let casa = await document.get();
                let response = casa.data();
                return res.status(200).send(response);
            } catch (error) {
                console.log(error);
                return res.status(500).send(error);
            }
        })();
    });

    









//Get Hello World
app.get('/hello-world', (req, res) => {
    return res.status(200).send('Hello World!');
});


// Create
app.post('/create', (req, res) => {
    (async () => {
        try {
            await db.collection('items').doc('/' + req.body.id + '/')
            .create({item: req.body.item});
                return res.status(200).send();  
            } catch (error) {
                console.log(error);
            return res.status(500).send(error);
        }
    })();
});

// read item
app.get('/readitem/:item_id', (req, res) => {
    (async () => {
        try {
            const document = db.collection('items').doc(req.params.item_id);
            let item = await document.get();
            let response = item.data();
            return res.status(200).send(response);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        })();
    });

// read all
app.get('/readall', (req, res) => {
    (async () => {
        try {
            let query = db.collection('items');
            let response = [];

            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs;
                for (let doc of docs) {
                    const selectedItem = {
                        id: doc.id,
                        item: doc.data().item
                    };
                    response.push(selectedItem);
                }
            });

            return res.status(200).send(response);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});


// update
app.put('/update/:item_id', (req, res) => {
    (async () => {
        try {
            const document = db.collection('items').doc(req.params.item_id);
            await document.update({
                item: req.body.item
            });
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});


// delete
app.delete('/delete/:item_id', (req, res) => {
    (async () => {
        try {
            const document = db.collection('items').doc(req.params.item_id);
            await document.delete();
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});


exports.app = functions.https.onRequest(app);