type UserSession = {
  id: string;
  name: string;
  image: string;
  email: string;
  expires: string;
  papers?: string[];
}

type StorePaperData = {
  uid: string;
  userId: string;
  userName: number;
  friendName: string;
  friendBirth: {
    nanoseconds: number;
    seconds: number;
  };
  completedUid: string;
  isCompleted: boolean;
  posts: PostData[];
}

type PaperData = {
  uid: string;
  userId: string;
  userName: number;
  friendName: string;
  friendBirth: string;
  completedUid: string;
  isCompleted: boolean;
  posts: PostData[];
}

type PostData = {
  key: string;
  name: string;
  message: string;
  initDate: Date;
  updateDate: Date;
}

type CompletedPaper = {
  posts: PostData[];
  isCompleted: boolean;
}

type UserPapers = PaperData[] | null;