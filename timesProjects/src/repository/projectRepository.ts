import mongoose from 'mongoose';
import { getModelForClass } from '@typegoose/typegoose';
import Project, { ProjectType } from '../models/project';
import config from '../utils/APIConfig';

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
        createdDate: new Date(),
        expiredAt: "2200-12-31"
      } as Project)
    })
  }
}

export default ProjectRepository;
