function validateTask(req, res, next) {
    const { title } = req.body;

    if (
        !title ||
        typeof title !== 'string' ||
        !title.trim()
    ) {
        return res.status(400).json({
            error: 'A non-empty title string is required'
        });
    }

    next();
}

module.exports = validateTask;