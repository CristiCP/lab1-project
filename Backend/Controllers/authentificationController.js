const jwt = require('jsonwebtoken');
module.exports = function(db) {
    return {
        LoginUser: function(req, res) {
            console.log("Login...");
            const { username, password } = req.body;
            db.query('SELECT * FROM authentication WHERE username = ? AND password = ?', [username, password], (error, results) => {
                if (error) {
                    console.error("Error executing query:", error);
                    res.status(500).send("Internal Server Error");
                } else {
                    if (results.length > 0) {
                        console.log("Login successful");
                        const token = jwt.sign({ username }, '5nB0$CZ4*!8x@1WQzPmY&rS#6QD!oF$D', { expiresIn: '5h' });
                        db.query('DELETE FROM tokens WHERE username = ?', [username], (deleteError, deleteResults) => {
                            if (deleteError) {
                                console.error("Error deleting tokens:", deleteError);
                                res.status(500).send("Internal Server Error");
                            } else {
                                db.query('INSERT INTO tokens (username, token) VALUES (?, ?)', [username, token], (insertError, insertResults) => {
                                    if (insertError) {
                                        console.error("Error storing token:", insertError);
                                        res.status(500).send("Internal Server Error");
                                    } else {
                                        res.status(200).json( token );
                                    }
                                });
                            }
                        });
                    } else {
                        console.log("Invalid credentials");
                        res.status(401).send("Invalid credentials");
                    }
                }
            });
        },
        SignUpUser: function(req, res) {
            console.log("Signup...");
            const { email, username, password } = req.body;
            db.query('SELECT * FROM authentication WHERE email = ? OR username = ?', [email, username], (error, results) => {
                if (error) {
                    console.error("Error executing query:", error);
                    res.status(500).send("Internal Server Error");
                } else {
                    if (results.length > 0) {
                        const existingEmail = results.find(result => result.email === email);
                        const existingUsername = results.find(result => result.username === username);
                        if (existingEmail && existingUsername) {
                            console.log("Email and username already exist");
                            res.status(409).send("Email and username already exist");
                        } else if (existingEmail) {
                            console.log("Email already exists");
                            res.status(409).send("Email already exists");
                        } else if (existingUsername) {
                            console.log("Username already exists");
                            res.status(409).send("Username already exists");
                        }
                    } else {
                        db.query('INSERT INTO authentication (email, username, password) VALUES (?, ?, ?)', [email, username, password], (insertError, insertResults) => {
                            if (insertError) {
                                console.error("Error inserting user:", insertError);
                                res.status(500).send("Internal Server Error");
                            } else {
                                console.log("User registered successfully");
                                res.status(201).send("User registered successfully");
                            }
                        });
                    }
                }
            });
        }
    };
}