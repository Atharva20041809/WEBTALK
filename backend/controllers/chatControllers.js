const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const accessChat = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  // Check if chat exists
  // Prisma doesn't have a direct "find chat where users array equals [a, b]" easily for M-N without some logic.
  // But we can check if there is a chat that is NOT a group chat and has BOTH users.

  // Find chats where isGroupChat is false
  // AND where the chat has ChatUser entries for BOTH req.user.id and userId
  
  // This query is a bit complex in Prisma.
  // We want a chat where:
  // 1. isGroupChat = false
  // 2. users include req.user.id AND userId
  
  var isChat = await prisma.chat.findMany({
    where: {
      isGroupChat: false,
      AND: [
        { users: { some: { userId: req.user.id } } },
        { users: { some: { userId: userId } } },
      ],
    },
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
          },
        },
      },
      messages: {
        take: 1,
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            sender: {
                select: {
                    username: true,
                    email: true
                }
            }
        }
      },
    },
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: {
        create: [
          { userId: req.user.id },
          { userId: userId },
        ],
      },
    };

    try {
      const createdChat = await prisma.chat.create({
        data: chatData,
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
              },
            },
          },
        },
      });
      res.status(200).json(createdChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
};

const fetchChats = async (req, res) => {
  try {
    // Fetch all chats where the user is a participant
    const results = await prisma.chat.findMany({
      where: {
        users: {
          some: {
            userId: req.user.id,
          },
        },
      },
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
        },
        groupAdmin: {
            select: {
                id: true,
                username: true,
                email: true,
                pic: true,
            }
        },
        messages: {
            take: 1,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                sender: {
                    select: {
                        username: true,
                        email: true
                    }
                }
            }
        }
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    res.status(200).send(results);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

const createGroupChat = async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the feilds" });
  }

  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  // Add current user to the group
  users.push(req.user.id);

  try {
    const groupChat = await prisma.chat.create({
      data: {
        chatName: req.body.name,
        users: {
            create: users.map((u) => ({ userId: typeof u === 'object' ? u.id : u })),
        },
        isGroupChat: true,
        groupAdmin: {
            connect: { id: req.user.id }
        },
      },
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
        },
        groupAdmin: {
            select: {
                id: true,
                username: true,
                email: true,
                pic: true,
            }
        }
      },
    });

    res.status(200).json(groupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

const renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await prisma.chat.update({
    where: { id: chatId },
    data: {
      chatName: chatName,
    },
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
        },
        groupAdmin: {
            select: {
                id: true,
                username: true,
                email: true,
                pic: true,
            }
        }
    },
  });

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
};

const addToGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  const added = await prisma.chat.update({
    where: { id: chatId },
    data: {
      users: {
        create: { userId: userId },
      },
    },
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
        },
        groupAdmin: {
            select: {
                id: true,
                username: true,
                email: true,
                pic: true,
            }
        }
    },
  });

  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
};

const removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  // We need to find the ChatUser record to delete it
  // But Prisma update on Chat doesn't easily let us "delete" a relation by userId directly in one go without finding the ChatUser id first or using deleteMany on the relation.
  
  // Easier way: delete from ChatUser directly
  const chatUser = await prisma.chatUser.findFirst({
      where: {
          chatId: chatId,
          userId: userId
      }
  });

  if(!chatUser) {
      return res.status(404).json({ message: "User not in chat"});
  }

  await prisma.chatUser.delete({
      where: { id: chatUser.id }
  });

  const fullChat = await prisma.chat.findUnique({
      where: { id: chatId },
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
        },
        groupAdmin: {
            select: {
                id: true,
                username: true,
                email: true,
                pic: true,
            }
        }
    },
  });

  res.json(fullChat);
};

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
