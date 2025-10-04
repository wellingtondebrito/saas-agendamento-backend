import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class EnderecoDto {
  @IsString()
  @IsNotEmpty()
  rua: string;

  @IsString()
  @IsNotEmpty()
  numero: string;

  @IsOptional()
  @IsString()
  complemento?: string;

  // exemplo de validação simples para CEP (PT-BR: 5 ou 8 dígitos com ou sem hífen)
  @IsOptional()
  @IsString()
  @Matches(/^\d{5}(-?\d{3})?$/, { message: 'CEP inválido' })
  cep?: string;

  @IsOptional()
  @IsString()
  bairro?: string;

  @IsOptional()
  @IsString()
  cidade?: string;

  @IsOptional()
  @IsString()
  estado?: string;
}

export class ContatoDto {
  // se deseja validar como número brasileiro, use IsPhoneNumber('BR')
  @IsOptional()
  @IsString()
  @IsPhoneNumber('BR')
  telefone?: string;

  @IsOptional()
  @IsString()
  @IsPhoneNumber('BR')
  whatsapp?: string;
}

export class UserResponseDto {
  id: number;
  nome: string;

  @Type(() => ContatoDto)
  contato: ContatoDto;
  email: string;

  @Type(() => EnderecoDto)
  endereco: EnderecoDto;
  avatarUrl?: string;
}

export class UserUpdateDto {
  @IsOptional() // <-- Adicionado: Permite atualizar APENAS o nome
  @IsString()
  @IsNotEmpty()
  nome?: string; // Alterar para opcional

  @IsOptional() // <-- Adicionado: Permite atualizar APENAS o contato
  @ValidateNested()
  @Type(() => ContatoDto)
  contato?: ContatoDto; // Alterar para opcional

  @IsOptional() // <-- Adicionado: Permite atualizar APENAS o email
  @IsEmail()
  email?: string; // Alterar para opcional

  @IsOptional() // <-- Adicionado: Permite atualizar APENAS o endereço
  @ValidateNested()
  @Type(() => EnderecoDto)
  endereco?: EnderecoDto; // Alterar para opcional

  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
