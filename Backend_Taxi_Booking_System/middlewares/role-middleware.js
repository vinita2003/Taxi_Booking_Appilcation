export const roleMiddleware = (role) => {
    return (req, res, next) => {
        if(req.user?.role === role){
            next()
        }else{
            res.status(403).json({message: 'Forbidden: You do not have access to this resource.' });
            
        }
    }
}