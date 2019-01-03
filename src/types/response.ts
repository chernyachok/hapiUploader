import { ResponseToolkit as ResponseExtended} from 'hapi';
import { IBoomMethods } from './common';

export interface Response extends ResponseExtended, IBoomMethods {}
