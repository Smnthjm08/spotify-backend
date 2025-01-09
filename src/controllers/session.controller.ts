import { z } from "zod";
import SessionModel from "../models/session.model";
import catchErrors from "../utils/catchError";

export const getSessionshandler = catchErrors(async (req, res) => {
  const sessions = await SessionModel.find(
    {
      userId: req.userId,
      expiresAt: { $gt: new Date() },
    },
    {
      _id: 1,
      userAgent: 1,
      createdAt: 1,
    },
    {
      sort: {
        createdAt: -1,
      },
    }
  );

  return res.status(200).json(
    sessions.map((session) => ({
      ...session.toObject(),
      ...(session.id === req.sessionId && {
        isCurrent: true,
      }),
    }))
  );
});

export const deleteSessionshandler = catchErrors(async (req, res) => {
  const sessionId = z.string().parse(req.params.id);

  const session = await SessionModel.findOne({
    userId: req.userId,
    _id: sessionId,
  });

  if (!session) {
    return res.status(404).json({
      message: "Session not found",
    });
  }

  await session.deleteOne();

  return res.status(200).json({
    message: "Session deleted",
  });
});
