const success = (res, message, data, status = 200) => res.status(status).json({success: true, message, data});
const failure = (res, reason = 'An error occurred, please try again.', status = 500) => res.status(status).json({success: false, message: reason });

export { success, failure };