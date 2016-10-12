using System;
using System.Collections.Generic;
using System.Data.SqlClient;

namespace ElifTechAPI.Model
{
    public class DbConnector : IDbConnector
    {
        public SqlConnection Сonnection;

        public DbConnector()
        {
            const string connectionString = @"Data Source = dmytroki.database.windows.net; Initial Catalog = companies; " +
                                            @"Integrated Security = False; User ID = dmytroki; Password = 125678965274kihi_; " +
                                            @"Connect Timeout = 15; Encrypt = True; TrustServerCertificate = False; " +
                                            @"ApplicationIntent = ReadWrite; MultiSubnetFailover = False";
            Сonnection = new SqlConnection(connectionString);
        }

        public List<Company> GetAll()
        {
            var command = new SqlCommand("Select cid, price, parentid, name from company order by parentid", Сonnection);
            try
            {
                Сonnection.Open();
            }
            catch (Exception)
            {
                Console.WriteLine("Cannot open connection to db in method GetAll()");
                return new List<Company>();
            }

            var reader = command.ExecuteReader();
            var companyList = new List<Company>();
            try
            {
                while (reader.Read())
                {
                    companyList.Add(new Company()
                    {
                        Id = (int)reader["cid"],
                        Name = reader["name"].ToString(),
                        Price = (double)reader["price"],
                        ParentId = (int)reader["parentid"]
                    }
                    );
                }
                return companyList;
            }
            catch (Exception)
            {
                Console.WriteLine("Cannot read from db in method GetAll()");
                return new List<Company>();
            }
            finally
            {
                reader.Dispose();
                Сonnection.Close();
            }
        }

        public Company GetById(int id)
        {
            var command = new SqlCommand("Select cid, price, parentid, name " +
                $"from company where cid = {id}", Сonnection);
            try
            {
                Сonnection.Open();
            }
            catch (Exception)
            {
                Console.WriteLine("Cannot open connection to db in method GetById");
                return new Company();
            }
            var reader = command.ExecuteReader();
            try
            {
                reader.Read();
                return new Company()
                {
                    Id = (int) reader["cid"],
                    Price = (double) reader["price"],
                    ParentId = (int) reader["parentid"],
                    Name = reader["name"].ToString()
                };
            }
            catch (Exception)
            {
                Console.WriteLine("Cannot read from db in method GetById()");
                return new Company();
            }
            finally
            {
                reader.Dispose();
                Сonnection.Close();
            }
        }

        public List<Company> GetByParentId(int id)
        {
            var command = new SqlCommand("Select cid, price, parentid, name " +
            $"from company where parentid = {id}", Сonnection);
            try
            {
                Сonnection.Open();
            }
            catch (Exception)
            {
                Console.WriteLine("Cannot open connection to db in method GetByParentId");
                return new List<Company>();
            }
            var reader = command.ExecuteReader();
            var companyList = new List<Company>();
            try
            {
                while (reader.Read())
                {
                    companyList.Add(new Company()
                    {
                        Id = (int)reader["cid"],
                        Name = reader["name"].ToString(),
                        Price = (double)reader["price"],
                        ParentId = (int)reader["parentid"]
                    }
                    );
                }
                return companyList;
            }
            catch (Exception)
            {
                Console.WriteLine("Cannot read from db in method GetByParentId()");
                return new List<Company>();
            }
            finally
            {
                reader.Dispose();
                Сonnection.Close();
            }
        }

        public int Add(Company company)
        {
            var command = new SqlCommand("Insert into company (name, price, parentid) output INSERTED.cid" +
                            $" Values ('{company.Name}', {company.Price}, {company.ParentId})", Сonnection);
            try
            {
                Сonnection.Open();
            }
            catch (Exception)
            {
                Console.WriteLine("Cannot open connection to db in method Add()");
                return -2;
            }
            try
            {
                return (int)command.ExecuteScalar();
            }
            catch (Exception)
            {
                Console.WriteLine("Cannot insert into db in method Add()");
                return -2;
            }
            finally
            {
                Сonnection.Close();
            }
        }

        public bool Edit(Company company)
        {
            var command = new SqlCommand("Update company SET " +
                                         $"name = '{company.Name}', " +
                                         $"price = '{company.Price}' " +
                                         $"where cid = {company.Id}",
                Сonnection);
            try
            {
                Сonnection.Open();
            }
            catch (Exception)
            {
                Console.WriteLine("Cannot open connection to db in method Edit()");
                return false;
            }
            try
            {
                return command.ExecuteNonQuery() > 0;
            }
            catch (Exception)
            {
                Console.WriteLine("Cannot update in db in method Edit()");
                return false;
            }
            finally
            {
                Сonnection.Close();
            }
        }

        public bool DeleteById(int id)
        {
            var command = new SqlCommand($"Delete from company where cid = {id}", Сonnection);
            try
            {
                Сonnection.Open();
            }
            catch (Exception)
            {
                Console.WriteLine("Cannot open connection to db in method DeleteAll");
                return false;
            }
            try
            {
                return command.ExecuteNonQuery() > 0;
            }
            catch (Exception)
            {
                Console.WriteLine("Cannot delete from db in method DeleteAll");
                return false;
            }
            finally
            {
                Сonnection.Close();
            }
        }

        public bool DeleteByIdWithChild(int id)
        {
            var success = DeleteById(id);
            var companies = GetByParentId(id);
            foreach (var company in companies)
            {
                DeleteByIdWithChild(company.Id);
            }
            return success;
        }

        public bool DeleteAll()
        {
            var command = new SqlCommand("Delete from company;\n" +
                                         "DBCC CHECKIDENT ('company', RESEED, 0)", Сonnection);
            try
            {
                Сonnection.Open();
            }
            catch (Exception)
            {
                Console.WriteLine("Cannot open connection to db in method DeleteAll");
                return false;
            }
            try
            {
                return command.ExecuteNonQuery() > 0;
            }
            catch (Exception)
            {
                Console.WriteLine("Cannot delete from db in method DeleteAll");
                return false;
            }
            finally
            {
                Сonnection.Close();
            }
        }
    }
}