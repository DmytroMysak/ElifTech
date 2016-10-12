namespace ElifTechAPI.Model
{
    public class Company
    {
        public int Id { get; set; }
        public int ParentId { get; set; }
        public string Name { get; set; }
        public double Price { get; set; }

    }
}