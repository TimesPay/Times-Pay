import { Request, Response } from 'express';
import commonConfig from '../../../utils/commonConfig';
import allInOneMiddleware from '../../../utils/middleware/allInOneMiddleware';
import WalletRepository from '../../../repository/walletRepository';

const handler = async (req: Request, res: Response) => {
  const { id } = req.query;
  if (id) {
    let walletRepo = new WalletRepository();
    const wallet = await walletRepo.getWalletByAddress(id);
    console.log("wallet", wallet);
    res.status(200).json({
      content: [
        {
          id: 1,
          title: "magic",
          detail: "magical research"
        }
      ],
      status: "success"
    });
  } else {
    res.status(502).json({
      content:[],
      status: "failed"
    });
  }
}
export default allInOneMiddleware(handler);

export const config = {
  ...commonConfig
}
