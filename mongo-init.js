db.createUser({
    user: "mimo",
    pwd: "mimo",
    roles: [{ role: "root", db: "admin" }],
  });
  