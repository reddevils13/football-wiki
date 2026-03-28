import { isEmpty, trim, get, isNil } from 'lodash';
import { IplScheduleRepository } from '../repositories/IplScheduleRepository';
import { IplSchedule, CreateIplScheduleDTO, UpdateIplScheduleDTO, PatchIplScheduleDTO } from '../models/IplSchedule';

export class IplScheduleService {
  constructor(private iplScheduleRepository: IplScheduleRepository) {}

  async createSchedule(data: CreateIplScheduleDTO): Promise<IplSchedule> {
    if (isEmpty(trim(get(data, 'homeTeam', '')))) {
      throw new Error('Home team is required');
    }
    if (isEmpty(trim(get(data, 'awayTeam', '')))) {
      throw new Error('Away team is required');
    }
    if (isNil(data.startTime)) {
      throw new Error('Start time is required');
    }
    return this.iplScheduleRepository.create(data);
  }

  async getScheduleById(id: string): Promise<IplSchedule | null> {
    return this.iplScheduleRepository.findById(id);
  }

  async getAllSchedules(): Promise<IplSchedule[]> {
    return this.iplScheduleRepository.findAll();
  }

  async getUpcomingSchedules(): Promise<IplSchedule[]> {
    return this.iplScheduleRepository.findUpcoming();
  }

  async getSchedulesByDateRange(startDate: Date, endDate: Date): Promise<IplSchedule[]> {
    return this.iplScheduleRepository.findByDateRange(startDate, endDate);
  }

  async updateSchedule(id: string, data: UpdateIplScheduleDTO): Promise<IplSchedule | null> {
    const schedule = await this.iplScheduleRepository.findById(id);
    if (isNil(schedule)) {
      throw new Error('Schedule not found');
    }

    if (data.homeTeam && isEmpty(trim(data.homeTeam))) {
      throw new Error('Home team cannot be empty');
    }
    if (data.awayTeam && isEmpty(trim(data.awayTeam))) {
      throw new Error('Away team cannot be empty');
    }

    return this.iplScheduleRepository.update(id, data);
  }

  async patchSchedule(id: string, data: PatchIplScheduleDTO): Promise<IplSchedule | null> {
    const schedule = await this.iplScheduleRepository.findById(id);
    if (isNil(schedule)) {
      throw new Error('Schedule not found');
    }

    if (data.betBy && isEmpty(trim(data.betBy))) {
      throw new Error('betBy cannot be empty');
    }
    if (data.betAt && isEmpty(trim(data.betAt))) {
      throw new Error('betAt cannot be empty');
    }
    if (data.wonBy && isEmpty(trim(data.wonBy))) {
      throw new Error('wonBy cannot be empty');
    }

    return this.iplScheduleRepository.update(id, data);
  }

  async deleteSchedule(id: string): Promise<boolean> {
    const schedule = await this.iplScheduleRepository.findById(id);
    if (isNil(schedule)) {
      throw new Error('Schedule not found');
    }
    return this.iplScheduleRepository.delete(id);
  }
}
