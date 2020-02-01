import Cors from 'micro-cors'

const cors = Cors({
  allowMethods: ["GET", "HEAD", "POST"],
});

export default cors;
