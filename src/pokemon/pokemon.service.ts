import { Injectable, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>
  ){}


  async create( createPokemonDto: CreatePokemonDto ) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase(); 

    try {
      const pokemon = await this.pokemonModel.create( createPokemonDto );
      return pokemon;
    } catch ( error ) {
      this.handleExceptions( error );
    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(search: string) {
    
    let pokemon: Pokemon;

    // Search by no
    if( !isNaN( +search )) {
      pokemon = await this.pokemonModel.findOne({ no: search });
    }

    // Search by MongoID
    if( !pokemon && isValidObjectId( search )) {
      pokemon = await this.pokemonModel.findById( search );
    }

    // Search by Name
    if( !pokemon ) {
      pokemon = await this.pokemonModel.findOne({ name: search.toLowerCase().trim() });
    }

    if( !pokemon )
      throw new NotFoundException(`Pokemon with id, name or no "${ search }" not found`);

    return pokemon;
  }

  async update(search: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne( search );

    if( updatePokemonDto.name )
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();

    try {
      await pokemon.updateOne( updatePokemonDto);
      return { ...pokemon.toJSON(), ...updatePokemonDto };

    } catch (error) {
      this.handleExceptions( error );
    }
  }

  async remove(id: string) {
    // const pokemon = await this.findOne( id );
    // await pokemon.deleteOne();
    const result = this.pokemonModel.findByIdAndDelete( id );
    return result;
  }


  private handleExceptions( error: any ) {
    if( error.code = 11000 ) {
      throw new BadRequestException(`Pokemon exists in DB ${ JSON.stringify( error.keyValue ) }`);
    }
    throw new InternalServerErrorException(`Can't update Pokemon`);
  }

}