import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export interface IPageRequest {
  page?: number;
  limit?: number;
  sort?: string;
  asc?: boolean;
  search_keyword?: string;
  offset?: number;
}

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_LIMIT = 10;
export const DEFAULT_PAGE_SORT = 'created_at';
export const DEFAULT_PAGE_ASC = false;

export class PageRequest implements IPageRequest {
  @ApiProperty({ name: 'page', default: DEFAULT_PAGE })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  page = DEFAULT_PAGE;

  @ApiProperty({ name: 'limit', default: DEFAULT_PAGE_LIMIT })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit = DEFAULT_PAGE_LIMIT;

  @ApiProperty({ name: 'sort', default: DEFAULT_PAGE_SORT })
  @IsString()
  @IsOptional()
  sort = DEFAULT_PAGE_SORT;

  @ApiProperty({ name: 'asc', default: DEFAULT_PAGE_ASC })
  @IsBoolean()
  @IsOptional()
  asc = DEFAULT_PAGE_ASC;

  @ApiProperty({ name: 'search_keyword', default: false })
  @IsString()
  @IsOptional()
  search_keyword?: string;

  get offset(): number {
    return (this.page - 1) * this.limit;
  }
}

export interface IPaginal<T> {
  content: T[];
  page: number;
  limit: number;
  first: boolean;
  last: boolean;
  totalPages: number;
  totalElements: number;
  numberOfElements: number;
  sort: string;
}

export class Paginal<T> implements IPaginal<T> {
  constructor(
    { page, limit, sort }: PageRequest,
    count: number,
    content: T[] | T,
  ) {
    const arrayOfContent = Array.isArray(content) ? content : [content];

    this.content = arrayOfContent;
    this.page = page;
    this.limit = limit;
    this.first = page === DEFAULT_PAGE;
    this.last = (page + 1) * limit >= count;
    this.totalPages = Math.ceil(count / limit) ?? 0;
    this.totalElements = count ?? 0;
    this.numberOfElements = arrayOfContent?.length;
    this.sort = sort;
  }

  content: T[];
  page: number;
  limit: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  totalElements: number;
  totalPages: number;
  sort: string;
}

export class FindPageOptions {
  where?: Record<string, any>;
  columns?: string[] | Record<string, any>;
  page: PageRequest;
}
