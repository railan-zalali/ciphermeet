import { Controller, Get, Delete, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '../../common/decorators/current-user.decorator';
import { ChatService } from './chat.service';

@ApiTags('chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) { }

    @Get('conversations')
    @ApiOperation({ summary: 'Daftar percakapan aktif' })
    getConversations(@CurrentUser() user: JwtPayload) {
        return this.chatService.getConversations(user.sub);
    }

    @Get('conversations/:id/messages')
    @ApiOperation({ summary: 'Pesan terenkripsi dalam percakapan' })
    getMessages(
        @CurrentUser() user: JwtPayload,
        @Param('id') conversationId: string,
        @Query('page') page = 1,
    ) {
        return this.chatService.getMessages(user.sub, conversationId, +page);
    }

    @Delete('messages/:id')
    @ApiOperation({ summary: 'Hapus pesan (soft delete)' })
    deleteMessage(@CurrentUser() user: JwtPayload, @Param('id') messageId: string) {
        return this.chatService.deleteMessage(user.sub, messageId);
    }
}
