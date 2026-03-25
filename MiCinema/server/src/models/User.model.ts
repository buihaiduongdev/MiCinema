import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import { User as UserType } from '@shared/schemas/user.schema';
import { ROLES } from '@shared/constants/roles';
import { MEMBERSHIP_TIER } from '@shared/constants/statuses';

export interface IUser extends Omit<UserType, 'password'>, Document {
  password: string;
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
    fullName: { type: String, required: true },
    phone: { type: String },
    avatar: { type: String },
    role: { type: String, enum: Object.values(ROLES), default: ROLES.CUSTOMER },
    isActive: { type: Boolean, default: true },
    loyaltyPoints: { type: Number, default: 0 },
    membershipTier: {
      type: String,
      enum: Object.values(MEMBERSHIP_TIER),
      default: MEMBERSHIP_TIER.BRONZE,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret: any) => {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  },
);
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);
