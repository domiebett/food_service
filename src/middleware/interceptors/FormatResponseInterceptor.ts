import { Interceptor, InterceptorInterface, Action } from 'routing-controllers';

@Interceptor()
export class FormatResponseInterceptor implements InterceptorInterface {
    intercept(action: Action, content: any) {
        if (content instanceof String)
            content = { message: content };
        else if (!content.error)
            content = { data: content };
            
        return content;
    }
}
