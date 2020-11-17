// setiak kali error akan menampilkan kalimat yang kita inginkan dan status server yg kita ingingkan

class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode
    }
}

module.exports = ErrorResponse;