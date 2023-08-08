//  This is a common pattern used in Express.js middleware to handle errors in asynchronous route handlers.

//  1) fn returns a promise
//  2) returns another fucntion that takes 3 parameters (req,res,next)
// 3) the fn (asynchronous function) is called using fn(req, res, next). The result of calling fn is a Promise that represents the asynchronous operation.

module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
