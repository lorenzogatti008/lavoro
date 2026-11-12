// ============================================================
//  PUNTO DI RIPARTENZA (CheckpointZone)
//  Quando il giocatore ci passa, le trappole lo riportano qui.
//
//  DOVE SI METTE
//    Trascina PF_Kit_Checkpoint dove vuoi un punto di ripartenza.
//
//  COSA CONFIGURARE (nell'Inspector)
//    Spawn Point: dove riparte il giocatore (vuoto = il centro della zona).
//    Message: il messaggio la prima volta che ci entri (vuoto = nessuno).
//
//  COME SI COLLEGA
//    Non va collegato: lavora insieme alle PressurePlate in modalita' Trap.
//
//  ESEMPIO
//    Un Checkpoint prima del corridoio delle trappole.
// ============================================================
using UnityEngine;

/// <summary>Punto di ripartenza: quando il giocatore ci entra, le trappole lo riportano qui.</summary>
[RequireComponent(typeof(Collider))]
public class CheckpointZone : MonoBehaviour
{
    [Tooltip("Dove riparte il giocatore (vuoto = il centro di questa zona)")] public Transform spawnPoint;
    [Tooltip("Messaggio la prima volta che ci entri (vuoto = nessuno)")] public string message = "Punto di ripartenza";

    bool reached;

    void Reset() { GetComponent<Collider>().isTrigger = true; }

    void OnTriggerEnter(Collider other)
    {
        if (!PlayerController.IsPlayer(other) || !GameManager.Instance) return;
        GameManager.Instance.SetCheckpoint(spawnPoint ? spawnPoint : transform);
        if (!reached && !string.IsNullOrEmpty(message)) GameManager.Instance.ShowMessage(message);
        reached = true;
    }

    void OnDrawGizmos() { KitGizmos.DrawZone(GetComponent<Collider>(), new Color(0.3f, 0.6f, 1f, 0.25f)); }
}
