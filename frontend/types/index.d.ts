type User = {
  image: string;
  name: string;
  emailVerified: null|string;
  email: string;
  id: string;
}

type PaperData = {
  userId: number;
  friendName: string;
  friendBirth: string;
  uid: string;
  completedUid: string;
  isCompleted: boolean;
  posts: any[];
}
