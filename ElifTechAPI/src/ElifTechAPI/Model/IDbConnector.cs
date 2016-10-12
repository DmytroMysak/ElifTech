using System.Collections.Generic;

namespace ElifTechAPI.Model
{
    public interface IDbConnector
    {
        List<Company> GetAll();

        Company GetById(int id);

        List<Company> GetByParentId(int id);

        int Add(Company company);

        bool Edit(Company company);

        bool DeleteById(int id);

        bool DeleteAll();

    }
}
