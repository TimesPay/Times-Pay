import Cors from 'micro-cors'

const cors = Cors({
  allowMethods: ["GET", "HEAD", "POST", "PUT"],
});

export default cors;
