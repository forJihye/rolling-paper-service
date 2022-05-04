interface Users {
  [userId: string]: {
    name: string;
    image: string;
    email: string;
    emailVerified: null;
    papers?: string[];
  }
}

interface Papers {
  [paperUid: string]: {
    userName: string;
    userId: string;
    friendName: string;
    friendBirth: string;
    isCompleted: string;
    completedUid: string;
    posts: {
      name: string;
      message: string
    }[]
  }
}

interface Complete {
  [completeUid: string]: {
    isCompleted: string;
    posts: {
      name: string;
      message: string
    }[]
  }
}