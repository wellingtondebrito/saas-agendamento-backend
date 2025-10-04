import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  ValidateNested,
  Length,
} from 'class-validator';
import { Type } from 'class-transformer';

export class EnderecoDto {
  @IsString()
  @IsOptional()
  rua: string;

  @IsString()
  @IsOptional()
  numero: string;

  @IsOptional()
  @IsOptional()
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

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 50, { message: 'A senha deve ter entre 8 e 50 caracteres.' })
  password: string;

  @IsOptional() // <-- Adicionado: Permite atualizar APENAS o contato
  @ValidateNested()
  @Type(() => ContatoDto)
  contato?: ContatoDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => EnderecoDto)
  endereco?: EnderecoDto;
}

export class SignInDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 50, { message: 'A senha deve ter entre 8 e 50 caracteres' })
  password: string;
}
