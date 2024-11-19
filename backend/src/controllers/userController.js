const registerUser = (req, res) => {
    res.send("registro");
};

const loginUser = (req, res) => {
    res.send("login");
};

module.exports = { registerUser, loginUser };
