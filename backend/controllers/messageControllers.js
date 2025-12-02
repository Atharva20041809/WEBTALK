const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    senderId: req.user.id,
    content: content,
    chatId: chatId,
  };

  try {
    var message = await prisma.message.create({
      data: newMessage,
      include: {
        sender: {
            select: {
                id: true,
                username: true,
                pic: true,
            }
        },
        chat: {
            include: {
                users: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                email: true,
                                pic: true,
                            }
                        }
                    }
                }
            }
        }
      },
    });

    // Update latest message in chat if we had a field for it, but we are querying it dynamically for now.
    // However, updating `updatedAt` of chat is good practice so it moves to top.
    await prisma.chat.update({
        where: { id: chatId },
        data: { updatedAt: new Date() }
    });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

const allMessages = async (req, res) => {
  try {
    const messages = await prisma.message.findMany({
      where: { chatId: req.params.chatId },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            pic: true,
            email: true,
          },
        },
        chat: true,
      },
    });

    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

module.exports = { sendMessage, allMessages };
