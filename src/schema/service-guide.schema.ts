import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"

@Schema({ _id: false, versionKey: false, timestamps: false })
class ScopeOfWorkItem {
    @Prop({ required: true })
    icon: string
    @Prop({ required: true })
    text: string
}
const ScopeOfWorkItemSchema = SchemaFactory.createForClass(ScopeOfWorkItem)

@Schema({ _id: false, versionKey: false, timestamps: false })
class Profile {
    @Prop({ required: true })
    name: string
    @Prop({ required: true })
    role: string
    @Prop({ required: true })
    introduction: string
    @Prop()
    imageUrl: string
    @Prop([String])
    career: string[]
    @Prop([String])
    skills: string[]
}
const ProfileSchema = SchemaFactory.createForClass(Profile)

@Schema({ _id: false, versionKey: false, timestamps: false })
class ProcessStep {
    @Prop({ required: true })
    icon: string
    @Prop({ required: true })
    title: string
    @Prop({ required: true })
    description: string
}
const ProcessStepSchema = SchemaFactory.createForClass(ProcessStep)

@Schema({ timestamps: true, collection: "service_guides" })
export class ServiceGuide extends Document {
    @Prop({ required: true, unique: true })
    key: string

    @Prop({ required: true })
    heroTitle: string

    @Prop({ required: true })
    heroSubtitle: string

    @Prop({ required: true })
    equipmentSectionTitle: string

    @Prop({ required: true })
    scopeOfWorkSectionTitle: string

    @Prop({ type: [ScopeOfWorkItemSchema], default: [] })
    scopeOfWork: ScopeOfWorkItem[]

    @Prop({ required: true })
    profileSectionTitle: string

    @Prop({ type: ProfileSchema })
    profile: Profile

    @Prop({ required: true })
    processSectionTitle: string

    @Prop({ type: [ProcessStepSchema], default: [] })
    processSteps: ProcessStep[]
}

export const ServiceGuideSchema = SchemaFactory.createForClass(ServiceGuide)
export type ServiceGuideDocument = ServiceGuide & Document 