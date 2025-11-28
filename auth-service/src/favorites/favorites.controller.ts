/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
    Controller,
    Get,
    Post,
    Delete,
    Body,
    Param,
    UseGuards,
    Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FavoritesService } from './favorites.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'; @ApiTags('favorites')
@ApiBearerAuth()
@Controller('api/favorites')
@UseGuards(AuthGuard('jwt'))
export class FavoritesController {
    constructor(private favoritesService: FavoritesService) { }

    @Get()
    @ApiOperation({ summary: 'Obtener lista de favoritos del usuario' })
    async getFavorites(@Req() req) {
        const favorites = await this.favoritesService.getFavorites(req.user.userId);
        return { favorites };
    }

    @Post()
    @ApiOperation({ summary: 'Agregar jugador a favoritos' })
    async addFavorite(@Req() req, @Body('playerId') playerId: string) {
        const favorites = await this.favoritesService.addFavorite(req.user.userId, playerId);
        return { favorites };
    }

    @Delete(':playerId')
    @ApiOperation({ summary: 'Eliminar jugador de favoritos' })
    async removeFavorite(@Req() req, @Param('playerId') playerId: string) {
        const favorites = await this.favoritesService.removeFavorite(req.user.userId, playerId);
        return { favorites };
    }
}
