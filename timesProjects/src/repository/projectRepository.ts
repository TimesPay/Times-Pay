import mongoose from 'mongoose';
import { getModelForClass } from '@typegoose/typegoose';
import Project, { ProjectType } from '../models/project';
import config from '../utils/APIConfig';
import moment from 'moment';

class ProjectRepository {
  public getProjects = (payload: ProjectType | undefined) => {
    return mongoose.connect(config.DBConnectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }).then(() => {
      let projectModel = getModelForClass(Project);
      return projectModel.find().exec();
    })
  }

  public getProjectById = (id:string) => {
    return mongoose.connect(config.DBConnectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }).then(() => {
      let projectModel = getModelForClass(Project);
      return projectModel.find({_id:id}).exec();
    })
  }

  public createProject = (payload: ProjectType) => {
    return mongoose.connect(config.DBConnectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }).then(() => {
      console.log("create Project api", payload);
      let projectModel = getModelForClass(Project);
      return projectModel.create({
        ...payload,
        createdAt: moment().toISOString(),
        expiredAt: "2200-12-31"
      } as Project)
    });
  }
  public EditProject = (id: string, payload: any) => {
    return mongoose.connect(config.DBConnectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }).then(()=>{
      let projectModel = getModelForClass(Project);
      return projectModel.findOneAndUpdate({
        _id:id
      },{
        ...payload
      },{
        omitUndefined: true,
        strict: true
      });
    })
  }
}

export default ProjectRepository;
