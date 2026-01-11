import type {Profile} from '../types/profile.js'

import {ShowCommand} from '../show-command.js'

export default class ProfileCommand extends ShowCommand<Profile> {
  static override aliases = ['whoami']
  static override description = 'Show profile details'
  static override examples = ['<%= config.bin %> <%= command.id %>']

  protected plainTemplate(profile: Profile): string | undefined {
    return `${profile.first_name} ${profile.last_name} <${profile.email}>`
  }

  protected showId(_args: {id: number | string}): number | string {
    return ''
  }

  protected showPath(_id: number | string): string {
    return '/api/profile/'
  }

  protected transformResult(profile: Profile): Profile {
    delete profile.password
    return profile
  }
}
