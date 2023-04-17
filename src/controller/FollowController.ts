import { Response } from 'express'
import { myDataBase } from '../db'
import { Follow } from '../entity/Follow'
import { User } from '../entity/User'
import { JwtRequest } from '../middleware/AuthMiddleware'

export class FollowController {
  static followUser = async (req: JwtRequest, res: Response) => {
    const { userId } = req.body
    const decoded = req.decoded

    const isExist = await myDataBase.getRepository(Follow).findOne({
      where: {
        following: { id: Number(decoded.id) },
        follower: { id: Number(userId) },
      },
    })

    if (!isExist) {
      const follower = await myDataBase.getRepository(User).findOneBy({
        id: Number(userId),
      })
      const following = await myDataBase.getRepository(User).findOneBy({
        id: decoded.id,
      })

      const follow = new Follow()
      follow.follower = follower
      follow.following = following

      await myDataBase.getRepository(Follow).insert(follow)
    } else {
      await myDataBase.getRepository(Follow).remove(isExist)
    }

    res.send({ message: 'success' })
  }

  static getFollower = async (req: JwtRequest, res: Response) => {
    const decoded = req.decoded

    const result = await myDataBase.getRepository(Follow).find({
      where: { follower: { id: Number(decoded.id) } },
    })
    res.send(result)
  }
}
