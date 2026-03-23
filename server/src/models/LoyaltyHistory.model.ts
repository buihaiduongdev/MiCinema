/**
 * LoyaltyHistory — Mongoose Model
 *
 * Fields: userId (ref User), points (positive=earn, negative=redeem),
 *         action (EARN|REDEEM|EXPIRE), description, bookingId? (ref Booking)
 *
 * Index: { userId, createdAt: -1 }
 */

import mongoose, { Schema, Document } from 'mongoose';
import { LOYALTY_ACTION } from '@shared/constants/statuses';

export interface ILoyaltyHistory extends Document {
    userId: mongoose.Types.ObjectId;
    points: number;
    action: (typeof LOYALTY_ACTION)[keyof typeof LOYALTY_ACTION];
    description: string;
    bookingId?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const loyaltyHistorySchema = new Schema<ILoyaltyHistory>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        points: {
            type: Number,
            required: true,
        },
        action: {
            type: String,
            enum: Object.values(LOYALTY_ACTION),
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        bookingId: {
            type: Schema.Types.ObjectId,
            ref: 'Booking',
        },
    },
    {
        timestamps: true,
    },
);

// Create composite index for efficient queries
loyaltyHistorySchema.index({ userId: 1, createdAt: -1 });

export const LoyaltyHistory = mongoose.model<ILoyaltyHistory>(
    'LoyaltyHistory',
    loyaltyHistorySchema,
);